<?php
	function http($url, $params=false) {
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		if($params)
			curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
		return json_decode(curl_exec($ch));
	}

	session_start();

	$client_id = '0oa2b35e5etxwDweI357';
	$client_secret = 'tMAFw4KwAul-mCVmidxJ7YjQmip88qyqyzAIjxkH';
	$redirect_uri = 'http://localhost:8080/';
	$metadata_url = 'https://dev-562040.okta.com/oauth2/default';
	// Fetch the authorization server metadata which contains a few URLs
	// that we need later, such as the authorization and token endpoints
	$metadata = http($metadata_url);

	if(isset($_GET['code'])) {
		if($_SESSION['state'] != $_GET['state']) {
			die('Authorization server returned an invalid state parameter');
		  }
		
		  if(isset($_GET['error'])) {
			die('Authorization server returned an error: '.htmlspecialchars($_GET['error']));
		  }

		  $response = http($metadata->token_endpoint, [
			'grant_type' => 'authorization_code',
			'code' => $_GET['code'],
			'redirect_uri' => $redirect_uri,
			'client_id' => $client_id,
			'client_secret' => $client_secret,
		  ]);
		
		  if(!isset($response->access_token)) {
			die('Error fetching access token');
		  }		  

		  $token = http($metadata->introspection_endpoint, [
			'token' => $response->access_token,
			'client_id' => $client_id,
			'client_secret' => $client_secret,
		  ]);
		
		  if($token->active == 1) {
			$_SESSION['username'] = $token->username;
			header('Location: /');
			die();
		  }		  
	}
	
	// Generate a random state parameter for CSRF security
	$_SESSION['state'] = bin2hex(random_bytes(5));

	// Build the authorization URL by starting with the authorization endpoint
	// and adding a few query string parameters identifying this application
	$authorize_url = $metadata->authorization_endpoint.'?'.http_build_query([
	'response_type' => 'code',
	'client_id' => $client_id,
	'redirect_uri' => $redirect_uri,
	'state' => $_SESSION['state'],
	'scope' => 'openid',
	]);
?>
