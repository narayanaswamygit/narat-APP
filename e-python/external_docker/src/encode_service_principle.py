def update_manual_subsription():
    import os
    from azure.keyvault.secrets import SecretClient
    from azure.identity import ClientSecretCredential, DefaultAzureCredential


    keyVaultName = 'SEC41e7c36c'
    KVUri = f"https://{keyVaultName}.vault.azure.net"

    AZURE_TENANT_ID="a2ac30f6-2793-4127-9427-b3d1ec1cd841"
    AZURE_CLIENT_SECRET="_F58Q~sWC-x5DPQgAoxbQFpmKduW2YNhbqAeFdh8"                             
    AZURE_CLIENT_ID="33e94e40-fc95-4314-8401-669b947a33c9"  

    credential = ClientSecretCredential(tenant_id = AZURE_TENANT_ID,
                                        client_id = AZURE_CLIENT_ID,
                                        client_secret = AZURE_CLIENT_SECRET)
    client = SecretClient(vault_url=KVUri, credential=credential)


    poller = client.begin_delete_secret('account')
    deleted_secret = poller.result()


    poller = client.begin_delete_secret('account')
    deleted_secret = poller.result()


    keyVaultName = 'kvtest666'
    KVUri = f"https://{keyVaultName}.vault.azure.net"

    credential = DefaultAzureCredential()
    client = SecretClient(vault_url=KVUri, credential=credential)


    retrieved_secret = client.get_secret('something')
    print(client.get_secret('account').value)
    print(retrieved_secret.value)

def create_encode_service_principle():
    import base64
    Tenant_ID = input("Enter Tenant Id:")
    Client_ID = input("Enter Client Id:")
    client_secret = input("Enter Client Secret Key:")

    sample =  Tenant_ID +";"+ client_secret +";"+ Client_ID
    print("smaple :",sample)
    mystr_encoded = base64.b64encode(sample.encode('utf-8'))
    #print("mystr_encoded in bytes:",mystr_encoded)
    mystr_decoded = mystr_encoded.decode('utf-8')
    print("mystr decoded in string:",mystr_decoded)
    return mystr_decoded

if __name__ =="__main__":
    create_encode_service_principle()
