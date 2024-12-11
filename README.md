# Google Apps Scripts Router for doGet / doPost 

Dead simple router to handle Web Request to Google Docs

## Examples

```
Router.get("/", (request)=> { return {"response": "root"}; })
```

```
Router.get("/foo", (request)=> { return {"response": "foo"}; })
```
