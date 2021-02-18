// Class definition

var KTFormControls = function () {
    // Private functions

    var myProfileValidation = function () {
        $("#frmMyProfile").validate({
            // define validation rules
            rules: {
                full_name: {
                    required: true,
                    letterswithbasicpunc: true
                },
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                full_name: {
                    required: "Please enter your full name",
                    letterswithbasicpunc: "Please enter alphabets only"
                },
                email: {
                    required: "Please enter your email",
                    email: "Please enter valid email"
                }
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }


    var changePasswordValidation = function () {
        $("#changePasswordForm").validate({
            // define validation rules
            rules: {
                old_password: {
                    required: true,
                },
                password: {
                    required: true,
                    minlength: 6
                },
                password_confirm: {
                    required: true,
                    minlength: 6,
                    equalTo: "#password"
                }
            },
            messages: {
                old_password: {
                    required: "Please enter your old password",
                    minlength: "Password must be atleast 6 characters length"
                },
                password: {
                    required: "Please enter your new password",
                },
                password_confirm: {
                    required: "Make sure that you have entered the same password here.",
                    minlength: "Confirm password must be atleast 6 characters length",
                    equalTo: "Confirm password must match with password"
                }
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }


    var editSettingValidation = function () {
        // alert('hgfd');
        $("#EditSetting").validate({

            // define validation rules
            rules: {
                title: {
                    required: true,
                    // letterswithbasicpunc: true
                }
            },
            messages: {
                title: {
                    required: "This field is required"
                }
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var addUserFrmValidation = function () {
        $("#frmAddUser").validate({
            rules: {
                full_name: {
                    required: true
                },
                username: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                phone: {
                    required: true,
                    number: true,
                    maxlength:10,
                    minlength:10
                },
                password: {
                    required: true,
                    minlength:6
                }
            },
            messages: {
                full_name: {
                    required: "Please enter full name"
                },
                username: {
                    required: "Please enter username"
                },
                email: {
                    required: "Please enter email address",
                    email: "Please enter valid email address",
                },
                phone: {
                    required: "Please enter phone number",
                    number: "Please enter valid phone number",
                    maxlength: "Please enter valid phone number",
                    minlength: "Please enter valid phone number"
                },
                password: {
                    required: "Please enter password",
                    minlength: "Password must be atleast 6 characters length"
                }
            },
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var editUserFrmValidation = function () {
        $("#frmEditUser").validate({
            rules: {
                full_name: {
                    required: true
                },
                username: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                phone: {
                    required: true,
                    number: true,
                    maxlength:10,
                    minlength:10
                }
            },
            messages: {
                full_name: {
                    required: "Please enter full name"
                },
                username: {
                    required: "Please enter username"
                },
                email: {
                    required: "Please enter email address",
                    email: "Please enter valid email address",
                },
                phone: {
                    required: "Please enter phone number",
                    number: "Please enter valid phone number",
                    maxlength: "Please enter valid phone number",
                    minlength: "Please enter valid phone number"
                }
            },
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }


    var blankSpaceNotAllow = function () {
        $("input").on("keypress", function (e) {
            var startPos = e.currentTarget.selectionStart;
            if (e.which === 32 && startPos == 0)
                e.preventDefault();
        })
    }

    return {
        // public functions
        init: function () {
            myProfileValidation();
            editSettingValidation();
            changePasswordValidation();
            
            addUserFrmValidation();
            editUserFrmValidation();
        }
    };
}();

jQuery(document).ready(function () {
    KTFormControls.init();
});