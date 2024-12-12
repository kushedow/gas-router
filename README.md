# Google Apps Scripts Router for doGet / doPost 

Dead simple router to handle Web Request to Google Docs

Works even for anonymous users with fallback ?query=/foo/bar

## Examples

**Simple Get**

```
Router.get("/", ()=> {
  return {"response": "root"};
})
```

```
Router.get("/foo", ()=> {
  return {"response": "foo endpoint"};
})
```

**Get with Parameter (express syntax!)**

```
Router.get("/bars/:id", (req)=> {
  return {"id": req.params.id};
})
```

**Simple Echo Post**

```
Router.post("/bars", (request) => {
  const data = request.json
  return data
})
```

