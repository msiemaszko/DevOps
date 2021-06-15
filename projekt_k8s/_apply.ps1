# rebuild
# .\comp-app_backend\_build.ps1
# .\comp-app_frontned\_build.ps1

echo "`nTworzenie Namespace:"
kubectl apply -f .\k8s-ns\comp-app-namespace.yaml

echo "`nLista Namespace:"
kubectl get namespace
# kubectl config set-context --current --namespace=comp-app-namespace
# kubectl config set-context --current --namespace=default

echo "`nTworzenie PV i PVC:"
kubectl apply -f .\k8s-pv\pv-local.yaml
kubectl apply -f .\k8s-postgres\my-postgres-pvc.yaml

echo "`nLista PV i PVC:"
kubectl get pv --namespace comp-app-namespace
kubectl get pvc --namespace comp-app-namespace

echo "`nTworzenie ConfigMap i Secret:"
kubectl apply -f .\k8s-redis\my-redis-configMap.yaml
kubectl apply -f .\k8s-postgres\my-postgres-configMap.yaml
kubectl apply -f .\k8s-postgres\my-postgres-secret.yaml

echo "`nLista ConfigMap:"
kubectl get cm --namespace comp-app-namespace
echo "`nLista Secret:"
kubectl get secret --namespace comp-app-namespace

echo "`nTworzenie Services:"
kubectl apply -f .\k8s-redis\my-redis-clusterip.yaml
kubectl apply -f .\k8s-postgres\my-postgres-clusterip.yaml
kubectl apply -f .\k8s-backend\my-backend-clusterip.yaml
kubectl apply -f .\k8s-nginx\my-nginx-clusterip.yaml

# kubectl apply -f .\k8s-backend\my-backend-node-port.yaml
# kubectl apply -f .\k8s-postgres\my-postgres-node-port.yaml
# kubectl apply -f .\k8s-nginx\my-nginx-node-port.yaml

echo "`nLista Services:"
kubectl get services --namespace comp-app-namespace

echo "`nTworzenie Deploy:"
kubectl apply -f .\k8s-redis\my-redis-deployment.yaml
kubectl apply -f .\k8s-postgres\my-postgres-deployment.yaml
kubectl apply -f .\k8s-backend\my-backend-deployment.yaml
kubectl apply -f .\k8s-nginx\my-nginx-deployment.yaml

echo "`nTworzenie Ingress Controllera:"
kubectl apply -f .\k8s-ingress\ingress-nginx-controller-v0.47.yaml

echo "`nOczekiwanie na Ingress Controller:"
kubectl wait --namespace ingress-nginx `
  --for=condition=ready pod `
  --selector=app.kubernetes.io/component=controller `
  --timeout=120s

echo "`Tworzenie Ingress:"
kubectl apply -f .\k8s-ingress\my-ingress.yaml

# echo "`nOczekiwanie 5 sekund..."
# Start-Sleep -Seconds 5

echo "`nLista Deploy:"
kubectl get deploy --namespace comp-app-namespace

# skalowanie deploy: 
# kubectl scale --replicas=1 deploy my-backend-deployment