<?php
	function http($url, $params=false) {
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		if($params)
		curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));

		// TODO DEBUG ONLY
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		// END DEBUG ONLY

		$content = curl_exec($ch);
		if ($content === false) {
			throw new Exception(curl_error($ch), curl_errno($ch));
		}

		return json_decode($content);
	}

	$domain = 'https://dev-562040.okta.com';
	$authorize_url = '/login.php';
	$register_url = '/login.php';
	$logout_url = '/login.php';

	session_start();

	$client_id = '0oa2b35e5etxwDweI357';
	$client_secret = 'tMAFw4KwAul-mCVmidxJ7YjQmip88qyqyzAIjxkH';
	$redirect_uri = 'http://localhost';
	$metadata_url = $domain.'/oauth2/default/.well-known/oauth-authorization-server';
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
	
	if(!isset($_SESSION['username'])) {
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

		$register_url = $domain.'/signin/register';
	}

	if (isset($_SESSION['username'])) {
		$logout_url = $metadata->end_session_endpoint.'?'.http_build_query([
			'response_type' => 'code',
			'client_id' => $client_id,
			'redirect_uri' => $redirect_uri,
			'state' => $_SESSION['state'],
			'scope' => 'openid',
			]);		
	}
?>
