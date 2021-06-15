kubectl delete deploy mybackendlb-deployment
kubectl delete deploy my-nginx-deployment
kubectl delete service my-nginx-clusterip
kubectl delete service mybackendlb-clusterip

# kubectl delete service my-nginx-node-port
# kubectl delete service mybackendlb-node-port

kubectl delete ingress myapp-ingress

kubectl delete namespace ingress-nginx

# incress controller:
# kubectl delete deployment.apps/ingress-nginx-controller --namespace=ingress-nginx
# kubectl delete pod/ingress-nginx-admission-create-bflz4 --namespace=ingress-nginx
# kubectl delete pod/ingress-nginx-admission-patch-z2mrl --namespace=ingress-nginx
# kubectl delete pod/ingress-nginx-controller-5b74bc9868-qlvkc --namespace=ingress-nginx
# kubectl delete service/ingress-nginx-controller --namespace=ingress-nginx
# kubectl delete service/ingress-nginx-controller-admission --namespace=ingress-nginx
# kubectl delete replicaset.apps/ingress-nginx-controller-5b74bc9868 --namespace=ingress-nginx
# kubectl delete job.batch/ingress-nginx-admission-create --namespace=ingress-nginx
# kubectl delete job.batch/ingress-nginx-admission-patch --namespace=ingress-nginx