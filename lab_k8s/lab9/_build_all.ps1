
# buildowanie image backend:
# docker build --tag marekprezes/mybackendlb ./mybackend
# docker run --rm --publish 5000:5000 marekprezes/mybackendlb
# docker push marekprezes/mybackendlb

echo "`nTworzenie pv i pvc:"
kubectl apply -f .\pv-local.yaml
kubectl apply -f .\postgres-pvc.yaml

echo "`nLista PV:"
kubectl get pv
echo "`nLista PVC:"
kubectl get pvc

echo "`nTworzenie configMap i SourceMap:"
kubectl apply -f .\postgres-configMap.yaml
kubectl apply -f .\postgres-secret.yaml

echo "`nLista configMap:"
kubectl get cm
echo "`nLista Secret:"
kubectl get secret

echo "`nTworzenie Services: clusterip i nodeport"
kubectl apply -f .\mybackend-clusterip.yaml
kubectl apply -f .\mybackend-node-port.yaml

kubectl apply -f .\postgres-clusterip.yaml
kubectl apply -f .\postgres-node-port.yaml

echo "`nLista services:"
kubectl get services


echo "`nTworzenie deploy:"
kubectl apply -f .\postgres-deployment.yaml
kubectl apply -f .\mybackend-deploy.yaml

echo "`nLista deploy:"
kubectl get deploy

# skalowanie deploy: 
# kubectl scale --replicas=1 deploy mybackend-deployment


echo "`nTest backend /hello:"
curl http://127.0.0.1:31000/hello | Select-Object -Expand Content
echo "`nTest backend /api:"
curl http://127.0.0.1:31000/api | Select-Object -Expand Content


echo "`n`nNacisnij klawisz, aby wszystko usunac :)"
pause 

# kasowanie 
kubectl delete deploy mybackend-deployment
kubectl delete deploy mypostgres-deployment

kubectl delete services mybackend-clusterip
kubectl delete services mybackend-node-port
kubectl delete services mypostgres-clusterip
kubectl delete services mypostgres-node-port

kubectl delete pvc postgres-pvc
kubectl delete pv pv-local