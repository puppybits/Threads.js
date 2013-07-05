/*
## Examples

Example: Synchronous Processing

    var result = Thread(function(localArg1, localArg2){
      //...access localArg1 and localArg2
      //...do stuff like, xhr, image processing on a background thread
      return result;
    }, 
    [localArg1, localArg2]);

Example: Asynchronous Processing

    Thread(function(localArg1, localArg2){
      //...do stuff like, xhr, image processing on a background thread
      var done = arguments[arguments.length-2];
      done(result);
    }, 
    [localArg1, localArg2], 
    function(results){
      //...recieve result in the main thread
    });
    
or

    Thread(myBackgroundThreadFunction, 
      [localArg1, localArg2], 
      function(results){
        //...recieve result in the main thread
    });

## Details
Thread will run the processing on the main UI thread if Workers are not supported. Functions on Worker threads are thread-safe becasue there is only a sub-set of the normal JS brower APIs available.  
@see [http://github.com/puppybits/Offline](http://github.com/puppybits/Offline) for a real world example

### Valid APIs in a Worker thread are:
    The navigator object  
    The location object (read-only)  
    XMLHttpRequest  
    setTimeout()/clearTimeout() and setInterval()/clearInterval()  
    The Application Cache  
    Importing external scripts using the importScripts() method  
    Spawning other web workers  

### Invalid APIs are:
    The DOM (it's not thread-safe)  
    The window object  
    The document object  
    The parent object  

[http://www.html5rocks.com/en/tutorials/workers/basics/](http://www.html5rocks.com/en/tutorials/workers/basics/)
*/

var Thread = function(fn, args, callback)
{
  var forceSingleThread = false,
  useThreads = (Blob && Worker && URL.createObjectURL && (forceSingleThread !== false)),
  
  createThread = function(fnc, args, callback)
  {
    var capturedArguments = args,
    synchronousAction = 'onmessage = function(event)' +
      '{\n'+
      'var done = function(returnValue)\n'+
      '{\n'+
      '  self.postMessage(returnValue);\n'+
      '},\n'+
      'args = Array.isArray(event.data) ? event.data : [event.data];\n'+
      'args.push(done);\n'+
      'var fn = '+
      fnc.toString() + 
      ',\n'+
      'returnValue = fn.apply(fn, args);\n'+
      'if (returnValue) done(returnValue);\n'+
      '};';
    
    var compile = new Blob([synchronousAction]),
    serizedAction = window.URL.createObjectURL(compile),
    thread = new Worker(serizedAction);
    thread.addEventListener('message', function(e)
    {
      callback(e.data);
    });
    
    var result = thread.postMessage(args);
    if (result && callback) callback(result);
    if (result && !callback) return result;
  },
  
  noThread = function(fnc, args, callback)
  {
    var done = function() 
    {
      callback.apply(callback, arguments);
    },
    args = Array.isArray(args) ? args : [args];
    args.push(done);
    var result = fnc.apply(fnc, args);
    if (result && callback) callback(result);
    if (result && !callback) return result;
  },
  
  schedule = useThreads ? createThread : noThread;
  
  return schedule(fn, args, callback);
}
