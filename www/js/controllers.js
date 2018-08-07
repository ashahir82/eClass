angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, Auth, SysConfig, $state, $ionicPopup, $http) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});
	
	showAlert = function(errTitle, errMsg) {
		var alertPopup = $ionicPopup.alert({
			title: errTitle,
			template: errMsg
		});
	}

	// Form data for the login modal
	$scope.loginData = {};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	// Triggered in the login modal to close it
	$scope.closeLogin = function() {
		$scope.modal.hide();
	};

	// Open the login modal
	$scope.login = function() {
		$scope.modal.show();
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function() {
		if(!angular.isDefined($scope.loginData.username) || !angular.isDefined($scope.loginData.password) || $scope.loginData.username.trim() == "" || $scope.loginData.password.trim() == "") {
			showAlert("Login Failed", "Please fill Username and Password");
			return;
		} else {
			$http.get(SysConfig.getLink + "doLogin.php?username=" + $scope.loginData.username + "&password=" + $scope.loginData.password).then(function (response) {
				if (response.data == "login_done") {
					Auth.setUser({
						username: $scope.loginData.username
					})
					$state.go("app.dashboard");
				} else if (response.data == "error1") {
					showAlert("Login Failed", "Invalid Username or Password");
				} else if (response.data == "error2") {
					showAlert("Login Failed", "No data sent");
				}
			}, 
			function(errResponse){
				showAlert("Connection Error", "Problem with network connection. Please try again.");
			});
		}
	};
	
	if (Auth.isLoggedIn()) {
		$scope.loggedin = Auth.getUser().username;
	}
	
	$scope.forgot = function () {
		$state.go("forget");
	}
	
	$scope.signup = function () {
		$state.go("register");
	}
	
	$scope.logout = function () {
		Auth.logout();
		$state.go("login");
	}
	
	$scope.myGoBack = function() {
		$state.go("app.dashboard");
	};
})

.controller('RegisterCtrl', function($scope, $http, $ionicPopup, $state, SysConfig) {
	$scope.regData = {};

	$scope.doRegister = function() {
		if(!angular.isDefined($scope.regData.username) || !angular.isDefined($scope.regData.fullname) || !angular.isDefined($scope.regData.email) || !angular.isDefined($scope.regData.password) || !angular.isDefined($scope.regData.confirm) || $scope.regData.username.trim() == "" || $scope.regData.fullname.trim() == "" || $scope.regData.email.trim() == "" || $scope.regData.password.trim() == "" || $scope.regData.confirm.trim() == "") {
			showAlert("Register Failed", "Please fill all field");
			return;
		} else {
			$http.get(SysConfig.getLink + "doRegister.php?username=" + $scope.regData.username + "&fullname=" + $scope.regData.fullname + "&email=" + $scope.regData.email + "&password=" + $scope.regData.password + "&confirm=" + $scope.regData.confirm)
				.success(function(data) {
				if (data.errors) {
					var i, errText = '';
					for (i = 0; i < data.errors.length; i++) {
						errText += data.errors[i] + '<br>';
					}
					
					var alertPopup = $ionicPopup.alert({
						title: 'Registration Failed',
						template: errText
					});
				} else if (data.success) {
					var alertPopup = $ionicPopup.alert({
						title: 'Registration',
						template: data.success
					});
					$state.go("login");
				}
			}).error(function(){
				var alertPopup = $ionicPopup.alert({
					title: 'Connection Error',
					template: 'Problem with network connection. Please try again.'
				});
			});
		}
	};
	
	$scope.login = function () {
		$state.go("login");
	}
})

.controller('dashboardCtrl', function($scope, Auth) {
	$scope.username = Auth.getUser().username;
})

.controller('CMNCtrl', function($scope, $http, $ionicLoading, SysConfig) {
	$ionicLoading.show();
	$http.get(SysConfig.getLink + "doGetCourse.php")
		.success(function(data) {
		$scope.items = data;
		$ionicLoading.hide();
	});
})

.controller('ModuleCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup, SysConfig) {
	$ionicLoading.show();
	$scope.hasData = undefined;
	$scope.courseName = $stateParams.courseName;
	$http.get(SysConfig.getLink + "doGetModule.php?course_id=" + $stateParams.courseId)
		.success(function(data) {
		if (data.errors) {
			var i, errText = '';
			for (i = 0; i < data.errors.length; i++) {
				errText += data.errors[i] + '<br>';
			}
			
			var alertPopup = $ionicPopup.alert({
				title: 'Module Failed',
				template: errText
			});
			alertPopup.then(function(res) {
				$scope.hasData = false;
			});
		} else {
			$scope.items = data;
			$scope.hasData = true;
		}
		$ionicLoading.hide();
		}).error(function(){
			var alertPopup = $ionicPopup.alert({
				title: 'Connection Error',
				template: 'Problem with network connection. Please try again.'
			});
		});
})

.controller('TopicCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup, Auth, SysConfig) {
	$ionicLoading.show();
	$scope.hasData = undefined;
	$scope.moduleName = $stateParams.moduleName;
	$http.get(SysConfig.getLink + "doGetTopic.php?module_id=" + $stateParams.moduleId + "&username=" + Auth.getUser().username)
		.success(function(data) {
		if (data.errors) {
			var i, errText = '';
			for (i = 0; i < data.errors.length; i++) {
				errText += data.errors[i] + '<br>';
			}
			
			var alertPopup = $ionicPopup.alert({
				title: 'Topic Failed',
				template: errText
			});
			alertPopup.then(function(res) {
				$scope.hasData = false;
			});
		} else {
			$scope.items = data;
			$scope.hasData = true;
		}
		$ionicLoading.hide();
	}).error(function(){
		var alertPopup = $ionicPopup.alert({
			title: 'Connection Error',
			template: 'Problem with network connection. Please try again.'
		});
	});
})

.controller('TopicMenuCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup, $state, Auth, SysConfig) {
	$ionicLoading.show();
	$scope.topicName = $stateParams.topicName;
	$http.get(SysConfig.getLink + "doGetTopicInfo.php?topic_id=" + $stateParams.topicId + "&username=" + Auth.getUser().username)
		.success(function(data) {
		$scope.items = data;
		$ionicLoading.hide();
	});
	
	$scope.showConfirm = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Topic Enrollment',
			template: 'Are you sure you want to enroll this topic?'
		});

		confirmPopup.then(function(res) {
			if(res) {
				$http.get(SysConfig.getLink + "doEnrollment.php?topic_id=" + $stateParams.topicId + "&username=" + Auth.getUser().username)
				.success(function(data) {
					if (data.errors) {
						var i, errText = '';
						for (i = 0; i < data.errors.length; i++) {
							errText += data.errors[i] + '<br>';
						}
						
						var alertPopup = $ionicPopup.alert({
							title: 'Enrollment Failed',
							template: errText
						});
					} else if (data.success) {
						var alertPopup = $ionicPopup.alert({
							title: 'Enrollment',
							template: data.success
						});
						alertPopup.then(function(res) {
							//window.location.reload();
							//$state.go('app.topicmenu', {}, {reload: true})
							$state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
						});
					}
				}).error(function(){
					var alertPopup = $ionicPopup.alert({
						title: 'Connection Error',
						template: 'Problem with network connection. Please try again.'
					});
				});
			}
		});
	};
	
	$scope.showWithdraw = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Topic Withdraw',
			template: 'Are you sure you want to withdraw this topic?'
		});

		confirmPopup.then(function(res) {
			if(res) {
				$http.get(SysConfig.getLink + "doWithdraw.php?topic_id=" + $stateParams.topicId + "&username=" + Auth.getUser().username)
				.success(function(data) {
					if (data.errors) {
						var i, errText = '';
						for (i = 0; i < data.errors.length; i++) {
							errText += data.errors[i] + '<br>';
						}
						
						var alertPopup = $ionicPopup.alert({
							title: 'Withdraw Failed',
							template: errText
						});
					} else if (data.success) {
						var alertPopup = $ionicPopup.alert({
							title: 'Withdraw',
							template: data.success
						});
						alertPopup.then(function(res) {
							//window.location.reload();
							//$state.go('app.topicmenu', {}, {reload: true})
							$state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
						});
					}
				}).error(function(){
					var alertPopup = $ionicPopup.alert({
						title: 'Connection Error',
						template: 'Problem with network connection. Please try again.'
					});
				});
			}
		});
	};
})

.controller('NoteCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup, $ionicSlideBoxDelegate, $state, Auth, SysConfig) {
	$ionicLoading.show();
	$scope.topicId = $stateParams.topicId;
	$scope.topicName = $stateParams.topicName;
	$http.get(SysConfig.getLink + "doGetNote.php?topic_id=" + $stateParams.topicId)
		.success(function(data) {
		$scope.items = data;
		$scope.totalSlide = $scope.items.length - 1;
		$ionicLoading.hide();
	}).error(function(){
		var alertPopup = $ionicPopup.alert({
			title: 'Connection Error',
			template: 'Problem with network connection. Please try again.'
		});
	});
	
	$scope.slideChanged = function(index) {
		$scope.slideIndex = index;
		if ($scope.slideIndex == $scope.totalSlide) {
			$http.get(SysConfig.getLink + "doEndNote.php?topic_id=" + $stateParams.topicId + "&username=" + Auth.getUser().username)
				.success(function(data) {
				if (data.errors) {
					var i, errText = '';
					for (i = 0; i < data.errors.length; i++) {
						errText += data.errors[i] + '<br>';
					}
					
					var alertPopup = $ionicPopup.alert({
						title: 'Enroll Failed',
						template: errText
					});
				}
			}).error(function(){
				var alertPopup = $ionicPopup.alert({
					title: 'Connection Error',
					template: 'Problem with network connection. Please try again.'
				});
			});
		}
	};
	
	$scope.next = function() {
		$ionicSlideBoxDelegate.next();
	};
	$scope.previous = function() {
		$ionicSlideBoxDelegate.previous();
	};
	$scope.quit = function(TId, TName) {
		$state.go("app.topicmenu", { topicId: TId, topicName: TName });
	};
})

.controller('QuizCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup, $ionicSlideBoxDelegate, $state, Auth, SysConfig, $timeout) {
	$ionicLoading.show();
	$scope.topicId = $stateParams.topicId;
	$scope.topicName = $stateParams.topicName;
	$http.get(SysConfig.getLink + "doGetQuiz.php?topic_id=" + $stateParams.topicId)
		.success(function(data) {
		$scope.items = data;
		$scope.totalSlide = $scope.items.length - 1;
		$ionicLoading.hide();
		$scope.counter = $scope.totalSlide * 30;
		$scope.startCounter = function() {
			updateCounter();
		};
	}).error(function(){
		var alertPopup = $ionicPopup.alert({
			title: 'Connection Error',
			template: 'Problem with network connection. Please try again.'
		});
	});
    
	$scope.lockSlide = function () {
        $ionicSlideBoxDelegate.enableSlide(false);
    }
	
	$scope.answers ={};
	$scope.submitAnswer = false;
	$scope.correctCount = 0;
	$scope.uncorrectCount = 0;
	$scope.totalScore = 0;
	$scope.unAnswer = 0;
	$scope.showResult = function(){
		$scope.stopCounter;
		$scope.correctCount = 0;
		$scope.uncorrectCount = 0;
		var qLength = $scope.items.length;
		for (var i = 0; i < qLength; i++) {
			var answers = $scope.items[i].answers;
			$scope.items[i].correct = false;
			$scope.items[i].userAnswer = $scope.answers[i];
			for (var j = 0; j < answers.length; j++) {
				answers[j].selected = "donno";
				if ($scope.items[i].userAnswer === answers[j].answer && answers[j].correct === true) {
					$scope.items[i].correct = true;
					answers[j].selected = "true";
					$scope.correctCount++;
				} else if ($scope.items[i].userAnswer === answers[j].answer && answers[j].correct === false) {
					answers[j].selected = "false";
					$scope.uncorrectCount++;
				} else if (answers[j].correct === true) {
					answers[j].selected = "correct";
				}
			}
		}
		$scope.totalScore = Math.round(($scope.correctCount / $scope.items.length) * 100);
		$scope.unAnswer = $scope.items.length - $scope.correctCount - $scope.uncorrectCount;
		$scope.submitAnswer = true;
		
		$http.get(SysConfig.getLink + "doEndQuiz.php?topic_id=" + $stateParams.topicId + "&username=" + Auth.getUser().username + "&mark=" + $scope.totalScore)
			.success(function(data) {
			if (data.errors) {
				var i, errText = '';
				for (i = 0; i < data.errors.length; i++) {
					errText += data.errors[i] + '<br>';
				}
				
				var alertPopup = $ionicPopup.alert({
					title: 'Quiz Failed',
					template: errText
				});
			}
		}).error(function(){
			var alertPopup = $ionicPopup.alert({
				title: 'Connection Error',
				template: 'Problem with network connection. Please try again.'
			});
		});
	};
	
	$scope.slideChanged = function(index) {
		$scope.slideIndex = index;
	};
	$scope.next = function() {
		$ionicSlideBoxDelegate.next();
	};
	$scope.previous = function() {
		$ionicSlideBoxDelegate.previous();
	};
	$scope.goto = function(to) {
		$ionicSlideBoxDelegate.slide(to);
	};
	$scope.selectAnswer = function(question, answer) {
		$scope.items[question].selected = answer;
	};
	$scope.cancelSubmit = function() {
		$ionicSlideBoxDelegate.slide(0);
	}
	$scope.quit = function(TId, TName) {
		$scope.stopCounter();
		$state.go("app.topicmenu", { topicId: TId, topicName: TName });
	};
	
	//If user click back
	$scope.$on("$locationChangeStart", function(event, next, current) { 
        $scope.stopCounter();
    });
	
	//Timer
	var timer;
	$scope.stopCounter = function() {
		$timeout.cancel(timer);
		timer = null;
	};
	var updateCounter = function() {
		$scope.counter--;
		timer = $timeout(updateCounter, 1000);
		if ($scope.counter == 0) {
			$scope.stopCounter();
			var alertPopup = $ionicPopup.alert({
				title: 'Time\'s up!',
				template: 'Please try again.'
			});
			$scope.showResult();
			$ionicSlideBoxDelegate.slide($scope.items.length);
		}
	};
	updateCounter();
})

.controller('EnrollCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup, SysConfig) {
	$ionicLoading.show();
	$scope.hasData = undefined;
	$http.get(SysConfig.getLink + "doGetEnrollment.php?username=" + $stateParams.username)
		.success(function(data) {
		if (data.errors) {
			var i, errText = '';
			for (i = 0; i < data.errors.length; i++) {
				errText += data.errors[i] + '<br>';
			}
			
			var alertPopup = $ionicPopup.alert({
				title: 'Enrollment Failed',
				template: errText
			});
			alertPopup.then(function(res) {
				$scope.hasData = false;
			});
		} else {
			$scope.items = data;
			$scope.hasData = true;
		}
		$ionicLoading.hide();
	}).error(function(){
		var alertPopup = $ionicPopup.alert({
			title: 'Connection Error',
			template: 'Problem with network connection. Please try again.'
		});
	});
})

.controller('ReportCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup, SysConfig) {
	$ionicLoading.show();
	$scope.hasData = undefined;
	$http.get(SysConfig.getLink + "doGetReport.php?username=" + $stateParams.username)
		.success(function(data) {
		if (data.errors) {
			var i, errText = '';
			for (i = 0; i < data.errors.length; i++) {
				errText += data.errors[i] + '<br>';
			}
			
			var alertPopup = $ionicPopup.alert({
				title: 'Enrollment Failed',
				template: errText
			});
			alertPopup.then(function(res) {
				$scope.hasData = false;
			});
		} else {
			$scope.items = data;
			$scope.hasData = true;
		}
		$ionicLoading.hide();
	}).error(function(){
		var alertPopup = $ionicPopup.alert({
			title: 'Connection Error',
			template: 'Problem with network connection. Please try again.'
		});
	});
})

.controller('ReportCardCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup, SysConfig, Auth) {
	$ionicLoading.show();
	$scope.hasData = undefined;
	$scope.getScore = {};
	$http.get(SysConfig.getLink + "doGetReportCard.php?topic_id=" + $stateParams.topicId + "&username=" + Auth.getUser().username)
		.success(function(data) {
		if (data.errors) {
			var i, errText = '';
			for (i = 0; i < data.errors.length; i++) {
				errText += data.errors[i] + '<br>';
			}
			
			var alertPopup = $ionicPopup.alert({
				title: 'Report Failed',
				template: errText
			});
			alertPopup.then(function(res) {
				$scope.hasData = false;
			});
		} else {
			$scope.items = data;
			$scope.hasData = true;
		}
		$ionicLoading.hide();
	}).error(function(){
		var alertPopup = $ionicPopup.alert({
			title: 'Connection Error',
			template: 'Problem with network connection. Please try again.'
		});
	});
})

.controller('ProfileCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup, SysConfig) {
	
	$scope.editData = {};
	
	$ionicLoading.show();
	$http.get(SysConfig.getLink + "doGetProfile.php?username=" + $stateParams.username)
		.success(function(data) {
		if (data.errors) {
			var i, errText = '';
			for (i = 0; i < data.errors.length; i++) {
				errText += data.errors[i] + '<br>';
			}
			
			var alertPopup = $ionicPopup.alert({
				title: 'Profile Failed',
				template: errText
			});
		} else {
			$scope.editData.username = data.username;
			$scope.editData.fullname = data.fullname;
			$scope.editData.email = data.email;
			$scope.editData.active = data.active;
			$scope.editData.last_login = data.last_login;
		}
		$ionicLoading.hide();
	}).error(function(){
		var alertPopup = $ionicPopup.alert({
			title: 'Connection Error',
			template: 'Problem with network connection. Please try again.'
		});
	});
	
	$scope.saveProfile = function() {
		if(!angular.isDefined($scope.editData.fullname) || !angular.isDefined($scope.editData.email) || $scope.editData.fullname.trim() == "" || $scope.editData.email.trim() == "") {
			showAlert("Save Failed", "Please fill Fullname and Email");
			return;
		} else {
			$http.get(SysConfig.getLink + "doEditProfile.php?username=" + $scope.editData.username + "&fullname=" + $scope.editData.fullname + "&email=" + $scope.editData.email + "&active=" + $scope.editData.active + "&mode=edit")
				.success(function(data) {
				if (data.errors) {
					var i, errText = '';
					for (i = 0; i < data.errors.length; i++) {
						errText += data.errors[i] + '<br>';
					}
					
					var alertPopup = $ionicPopup.alert({
						title: 'Profile Failed',
						template: errText
					});
				} else if (data.success) {
					var alertPopup = $ionicPopup.alert({
						title: 'Profile',
						template: data.success
					});
				}
			}).error(function(){
				var alertPopup = $ionicPopup.alert({
					title: 'Connection Error',
					template: 'Problem with network connection. Please try again.'
				});
			});
		}
	};
})

.controller('PasswordCtrl', function($scope, $http, $stateParams, $ionicPopup, $state, SysConfig) {
	$scope.editPass = {};
	$scope.editPass.username = $stateParams.username;

	$scope.savePassword = function() {
		if(!angular.isDefined($scope.editPass.current) || !angular.isDefined($scope.editPass.new) || !angular.isDefined($scope.editPass.repeat) || $scope.editPass.current.trim() == "" || $scope.editPass.new.trim() == "" || $scope.editPass.repeat.trim() == "") {
			showAlert("Save Failed", "Please fill all field");
			return;
		} else {
			$http.get(SysConfig.getLink + "doEditPassword.php?username=" + $scope.editPass.username + "&current=" + $scope.editPass.current + "&new=" + $scope.editPass.new + "&repeat=" + $scope.editPass.repeat)
				.success(function(data) {
				if (data.errors) {
					var i, errText = '';
					for (i = 0; i < data.errors.length; i++) {
						errText += data.errors[i] + '<br>';
					}
					
					var alertPopup = $ionicPopup.alert({
						title: 'Password Failed',
						template: errText
					});
				} else if (data.success) {
					var alertPopup = $ionicPopup.alert({
						title: 'Password',
						template: data.success
					});
					$state.go("app.profile", { username: $scope.editPass.username });
				}
			}).error(function(){
				var alertPopup = $ionicPopup.alert({
					title: 'Connection Error',
					template: 'Problem with network connection. Please try again.'
				});
			});
		}
	};
	
	$scope.quit = function(UName) {
		$state.go("app.profile", { username: UName });
	};
})

.controller('AcPassCtrl', function($scope, $http, $ionicPopup, $state, SysConfig) {
	$scope.forgotData = {};

	$scope.doForgot = function() {
		if(!angular.isDefined($scope.forgotData.username) || !angular.isDefined($scope.forgotData.email) || $scope.forgotData.username.trim() == "" || $scope.forgotData.email.trim() == "") {
			showAlert("Check Failed", "Please fill all field");
			return;
		} else {
			$http.get(SysConfig.getLink + "doGetPassword.php?username=" + $scope.forgotData.username + "&email=" + $scope.forgotData.email)
				.success(function(data) {
				if (data.errors) {
					var i, errText = '';
					for (i = 0; i < data.errors.length; i++) {
						errText += data.errors[i] + '<br>';
					}
					
					var alertPopup = $ionicPopup.alert({
						title: 'Password Failed',
						template: errText
					});
				} else if (data.success) {
					$state.go("reset", { username: $scope.forgotData.username });
					$scope.forgotData = {};
				}
			}).error(function(){
				var alertPopup = $ionicPopup.alert({
					title: 'Connection Error',
					template: 'Problem with network connection. Please try again.'
				});
			});
		}
	};
	
	$scope.login = function () {
		$state.go("login");
	}
})

.controller('ResetPassCtrl', function($scope, $http, $stateParams, $ionicPopup, $state, SysConfig) {
	$scope.resetPass = {};
	$scope.resetPass.username = $stateParams.username;

	$scope.resetPassword = function() {
		if(!angular.isDefined($scope.resetPass.username) || !angular.isDefined($scope.resetPass.new) || !angular.isDefined($scope.resetPass.repeat) || $scope.resetPass.username.trim() == "" || $scope.resetPass.new.trim() == "" || $scope.resetPass.repeat.trim() == "") {
			showAlert("Save Failed", "Please fill all field");
			return;
		} else {
			$http.get(SysConfig.getLink + "doResetPassword.php?username=" + $scope.resetPass.username + "&new=" + $scope.resetPass.new + "&repeat=" + $scope.resetPass.repeat)
				.success(function(data) {
				if (data.errors) {
					var i, errText = '';
					for (i = 0; i < data.errors.length; i++) {
						errText += data.errors[i] + '<br>';
					}
					
					var alertPopup = $ionicPopup.alert({
						title: 'Password Failed',
						template: errText
					});
				} else if (data.success) {
					var alertPopup = $ionicPopup.alert({
						title: 'Password',
						template: data.success
					});
					$state.go("login");
				}
			}).error(function(){
				var alertPopup = $ionicPopup.alert({
					title: 'Connection Error',
					template: 'Problem with network connection. Please try again.'
				});
			});
		}
	};
	
	$scope.quit = function() {
		$state.go("forget");
	};
})

.filter('formatTimer', function() {
  return function(input)
    {
        function z(n) {return (n<10? '0' : '') + n;}
        var seconds = input % 60;
        var minutes = Math.floor(input / 60);
        return (z(minutes)+':'+z(seconds));
    };
})