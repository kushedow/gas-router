const Router = {
  routes: { GET: {}, POST: {} },

  get(path, callable) {this.add("GET", path, callable);},
  post(path, callable) {this.add("POST", path, callable);},
  add(method="GET", path, callable) {
    this.validateMethod(method); 
    this.validatePath(path); 
    this.validateCallable(callable); 
    this.routes[method][path] = callable;
  },
  open(method = "GET", path = "",  request = {}) {
    try {
       if (!this.routeExists(method, path)) {this.throw(`NOT FOUND ${method} ${path}`);}
       result = this.routes[method][path](request);
    } catch(error){
       return this.toJSON({"error": error.toString() }) 
    }
    return this.toJSON(result)
  },
  validateMethod(method) { if (!["POST", "GET"].includes(method)) {this.throw(`Unsupported Method ${method}`);}},
  validatePath(path){ if (!path[0]=="/") {this.throw(`Route ${path} should start with /`); }},
  validateCallable(callable) { if (!(callable instanceof Function)) { this.throw('Cannot add route handler, a Callable (function) is expected');}},

  toJSON(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);},
  routeExists(method, path) {return this.routes[method].hasOwnProperty(path);},
  throw(message) { Logger.log(`❌ ${message}`); throw new Error(message);}
};

function doGet(req){ return Router.open("GET", "/"+ (req.pathInfo ? req.pathInfo : "") , req) }
function doPost(req){ return Router.open("POST", "/"+ (req.pathInfo ? req.pathInfo : ""), req) }

