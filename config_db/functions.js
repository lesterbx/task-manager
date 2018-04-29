var newUser = function (newDoc, savedDoc) {
  function required(field, message){
    if(newDoc[field] === undefined || newDoc[field] === ''){
      throw({forbidden: message});
    }
  }

  required('first_name', 'Missing first name');
  required('last_name', 'Missing last name');
  required('name', 'Missing email');

  function valid(field, regex, message){
    if(!regex.test(newDoc[field])){
      throw({forbidden: message});
    }
  }

  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var nameRegex = /^[a-zA-Z]+$/;

  valid('name', emailRegex, 'Invalid email format');
  valid('first_name', nameRegex, 'First name can only contain letters');
  valid('last_name', nameRegex, 'Last name can only contain letters');

}