const Router = {

  routes: { GET: {}, POST: {} }, // type Route = 

  get(path, callable) {this.add("GET", path, callable);},
  post(path, callable) {this.add("POST", path, callable);},
  add(method="GET", path, callable) {
    this.validateMethod(method); 
    this.validatePath(path); 
    this.validateCallable(callable); 
    this.routes[method][path] = callable;
  },

  matchRoute(requestPath, routes){

    const requestSegments = requestPath.split("/")
    for ([routePath, callable] of Object.entries(routes)){
        const params = {}
        let match = true
        const routeSegments = routePath.split("/")
        if (requestSegments.length !== routeSegments.length){continue}  
        for (const [index, oneRouteSegment] of routeSegments.entries()) {
           if (oneRouteSegment[0] == ":") { params[oneRouteSegment] = requestSegments[index]; continue; }
           if (oneRouteSegment !== requestSegments[index]){ match = false }
        }
        if (match) {return {path: routePath, callable: callable, params: params}}
    }
  },

  open(method = "GET", path = "",  request = {}, json=true) {

    try {
       route = this.matchRoute(path, this.routes[method])
       if (!route) {this.throw(`NOT FOUND ${method} ${path}`);}
       request.params = route.params
       result = route.callable(request);

    } catch(error){
       return this.toJSON({"error": error.toString() }) 
    }
    return json ? this.toJSON(result) : result
  },
  validateMethod(method) { if (!["POST", "GET"].includes(method)) {this.throw(`Unsupported Method ${method}`);}},
  validatePath(path){ if (!path[0]=="/") {this.throw(`Route ${path} should start with /`); }},
  validateCallable(callable) { if (!(callable instanceof Function)) { this.throw('Cannot add route handler, a Callable (function) is expected');}},

  toJSON(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);},
  
  throw(message) { Logger.log(`❌ ${message}`); throw new Error(message);}
};

function doGet(req){ return Router.open("GET", "/"+ (req.pathInfo ? req.pathInfo : "") , req) }
function doPost(req){ return Router.open("POST", "/"+ (req.pathInfo ? req.pathInfo : ""), req) }
