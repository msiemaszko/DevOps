
# rebuild
# .\comp-app_backend\_build.ps1
# .\comp-app_frontned\_build.ps1

echo "`nTworzenie pv i pvc:"
kubectl apply -f .\pv-local.yaml
kubectl apply -f .\k8s-postgres\postgres-pvc.yaml

echo "`nLista PV:"
kubectl get pv
echo "`nLista PVC:"
kubectl get pvc

echo "`nTworzenie configMap i SourceMap:"
kubectl apply -f .\k8s-redis\redis-configMap.yaml
kubectl apply -f .\k8s-postgres\postgres-configMap.yaml
kubectl apply -f .\k8s-postgres\postgres-secret.yaml

# TODO: sprawdzić
# kubectl apply -f .\k8s-backend\backend-configMap.yaml


echo "`nLista configMap:"
kubectl get cm
echo "`nLista Secret:"
kubectl get secret

echo "`nTworzenie Services: clusterip i nodeport"
kubectl apply -f .\k8s-redis\redis-clusterip.yaml

kubectl apply -f .\k8s-backend\backend-clusterip.yaml
kubectl apply -f .\k8s-backend\backend-node-port.yaml

kubectl apply -f .\k8s-postgres\postgres-clusterip.yaml
kubectl apply -f .\k8s-postgres\postgres-node-port.yaml

kubectl apply -f .\k8s-nginx\nginx-node-port.yaml

echo "`nLista services:"
kubectl get services



echo "`nTworzenie POD dla redis:"
kubectl apply -f .\k8s-redis\redis-pod.yaml

echo "`nTworzenie deploy:"
kubectl apply -f .\k8s-postgres\postgres-deployment.yaml
kubectl apply -f .\k8s-backend\backend-deployment.yaml
kubectl apply -f .\k8s-nginx\nginx-deployment.yaml


echo "`nOczekiwanie 5 sekund..."
Start-Sleep -Seconds 5

echo "`nLista deploy:"
kubectl get deploy

# skalowanie deploy: 
# kubectl scale --replicas=1 deploy backend-deployment


echo "`nTest backend /api:"
curl http://127.0.0.1:31000/computer | Select-Object -Expand Content

Start-Sleep -Seconds 3

echo "`nTest frontend:"
curl http://127.0.0.1:31003 | Select-Object -Expand Content


echo "`n`nNacisnij klawisz, aby wszystko usunac :)"
pause 

# kasowanie 
kubectl delete deploy backend-deployment
kubectl delete deploy postgres-deployment
kubectl delete deploy nginx-deployment
kubectl delete pod redis-pod

kubectl delete services backend-clusterip
kubectl delete services backend-node-port
kubectl delete services postgres-clusterip
kubectl delete services postgres-node-port

kubectl delete services redis-clusterip
kubectl delete services nginx-node-port

# kubectl delete cm backend-config
kubectl delete cm postgres-config
kubectl delete cm redis-config
kubectl delete secret postgres-secret

kubectl delete pvc postgres-pvc
kubectl delete pv pv-local
