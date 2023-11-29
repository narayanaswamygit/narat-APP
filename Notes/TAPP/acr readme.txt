---
# _Extraction_
---

### Create Azure Container Registry
	
	Go to Services -> Container Registries
	Click on Add
	Subscription: <Subscription>
	Resource Group: <RG>
	Registry Name: paigesACR (NAME should be unique across Azure Cloud)
	Location: Central India
	SKU: Basic 
	Click on Review + Create
	Click on Create
 
### Docker Build
	
	docker build --no-cache -t paiges_extract:39.0.RELEASE .

### List Docker Images

	docker images
	docker images paiges_extract:6.0.RELEASE
	
### Enable Docker Login for ACR Repository
	
	Go to Services -> Container Registries -> paigesACR2
	Go to Access Keys
	Click on Enable Admin User
	Make a note of Username and password


### set kube-config to connect to cluster in Azure

	az aks get-credentials --resource-group <resource-group> --name <AKS cluster>
	az aks get-credentials --resource-group RG-TAPP --name aks-paiges-extraction  
# Integrate ACR with AKS
	
	export ACR_REGISTRY=paigesacr3.azurecr.io
	export ACR_NAMESPACE=app1
	export ACR_IMAGE_NAME=paiges_extract
	export ACR_IMAGE_TAG=39.0.RELEASE
	echo $ACR_REGISTRY, $ACR_NAMESPACE, $ACR_IMAGE_NAME, $ACR_IMAGE_TAG

### Login to ACR

	docker login $ACR_REGISTRY

### Tag

	docker tag paiges_extract:6.0.RELEASE  $ACR_REGISTRY/$ACR_NAMESPACE/$ACR_IMAGE_NAME:$ACR_IMAGE_TAG

#### It replaces as below
	docker tag paiges_extract:6.0.RELEASE paigesacr2.azurecr.io/app1/paiges_extract:6.0.RELEASE
	
	
### List Docker Images to verify

	docker images paiges_extract:6.0.RELEASE
	docker images $ACR_REGISTRY/$ACR_NAMESPACE/$ACR_IMAGE_NAME:$ACR_IMAGE_TAG

### Push Docker Images

	docker push $ACR_REGISTRY/$ACR_NAMESPACE/$ACR_IMAGE_NAME:$ACR_IMAGE_TAG



# Configure ACR integration with existing AKS Cluster

### Set ACR NAME

	export ACR_NAME=paigesACR3
	echo $ACR_NAME



### Template

	az aks update -n myAKSCluster -g myResourceGroup --attach-acr <acr-name>

### Replace Cluster, Resource Group and ACR Repo Name

	az aks update -n aks-paiges-extraction -g RG-TAPP --attach-acr $ACR_NAME

## Update Deployment Manifest with Image Name
	
	spec:
      containers:
        - name: paiges-extract-api
          image: paigesacr2.azurecr.io/app1/paiges_extract:6.0.RELEASE
          imagePullPolicy: Always
          ports:
            - containerPort: 80

	
## Deploy to kubernetes
	kubectl apply -f kube-manifests/deployment_manual.yaml

## Deploy metrics server

```
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml



paigesacr2.azurecr.io/app1/paiges_extract:5.0.RELEASE

```