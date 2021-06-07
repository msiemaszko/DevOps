import './App.css';
import { useState } from 'react';
import Post from './Post';
import MyForm from './MyForm';

function App() {

	// webhook 1 - useState
	const [initialValue, setInitialValue] = useState(5);

	const InitialValueHandler = event => {
		setInitialValue(event.target.value);
	}

	return (
		<div>
			{initialValue}
			<input onChange={InitialValueHandler} value={initialValue}/>
			<Post noPosts={initialValue} changeParentHandler={setInitialValue}/>
			<MyForm/>
		</div>
	);
}

export default App;
