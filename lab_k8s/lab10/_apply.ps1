# build
# docker build --tag marekprezes/mybackendlb .\mybackend
# docker push marekprezes/mybackendlb

echo "`nmy-test-app:"
kubectl apply -f mybackendlb-deploy.yaml
kubectl apply -f mybackendlb-clusterip.yaml
kubectl apply -f my-nginx-deployment.yaml
kubectl apply -f my-nginx-clusterip.yaml

# kubectl apply -f my-nginx-node-port.yaml
# kubectl apply -f mybackendlb-node-port.yaml

echo "`nIngress Controller:"
# v 46
# kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.46.0/deploy/static/provider/cloud/deploy.yaml

# v 47
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.47.0/deploy/static/provider/cloud/deploy.yaml

echo "`nWaiting for Ingress:"
kubectl wait --namespace ingress-nginx `
  --for=condition=ready pod `
  --selector=app.kubernetes.io/component=controller `
  --timeout=120s

echo "`nIngress Services:"
kubectl get all --namespace=ingress-nginx

echo "`nMy Ingress:"
kubectl apply -f myapp-ingress.yaml