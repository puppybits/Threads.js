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
    
    var num1 = 1, // main UI thread
    num2 = 2,
    result = Thread(function(num1, num2){
      var result;
      for (var i = 0; i < 10000000; i++) // background worker thread
      {
        result = num1 + num2;
        num1 = num2;
        num2 = result;
      }
      return num1;
    }, 
    [num1, num2]); // pass in the variables for when the function is called
    
    console.log(result); // main UI Thread

Example: Asynchronous Processing


    var uri = 'http://localhost:8000/api/planning'; // main UI Thread
    Thread(function(uri){
      var done = arguments[arguments.length-2], // background worker thread
      xhr = new XMLHttpRequest();
      xhr.open('GET', uri);
      xhr.onload = function(e) 
      { 
        done(e.responseText);
      }
    }, 
    [uri], // pass in the variables for when the function is called
    function(results){
      console.log(results); // main UI Thread
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



