# Thread.js

## Dead-simple JavaScript Threading

* Make it simple to use threads and recieve the result.
* If the browser doesn't support threads then the function will run on the main UI thread.
* Getting started is 3 easy steps. 
  1. Create a function inline 
  2. Pass in the function params as a array
  3. Recieve the results either as the return or as a callback


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

## Roadmap

* add object pooling 
  * this is to better use memory, don't create new threads on every call
* support Promise A interface
* create js pref to test speed differences between object pooling on/off and workload on background threads vs main UI thread
* unit tests



