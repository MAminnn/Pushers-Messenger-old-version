using EmailSender;
using System.Threading.Tasks;
using Api.Models.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using System.Collections.Generic;

namespace Api.Controllers
{
    public class Account : Controller
    {

        #region Ioc
        private UserManager<IdentityUser<int>> _userManager;

        private SignInManager<IdentityUser<int>> _signinManager;

        private RoleManager<IdentityRole<int>> _roleManager;

        private EmailInformation _emailInfo;

        private IEmailSender _emailSender;

        public Account(UserManager<IdentityUser<int>> userManager, SignInManager<IdentityUser<int>> signInManager, RoleManager<IdentityRole<int>> roleManager,
            IEmailSender emailSender, EmailInformation emailInfo)
        {
            _signinManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _emailSender = emailSender;
            _emailInfo = emailInfo;
        }
        #endregion

        public IActionResult Index(string ReturnUrl = null, string pagetype = "1")
        {
            ViewBag.ReturnUrl = ReturnUrl;
            ViewBag.pageType = pagetype;
            return View();
        }
        [Route("/api/login")]
        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel loginModel, string ReturnUrl)
        {
            var result = await _signinManager.PasswordSignInAsync(loginModel.lUserName, loginModel.lPassword, loginModel.lRememberMe, true);
            if (result.Succeeded)
            {
                if (ReturnUrl != null)
                    return Redirect(ReturnUrl);
                return Redirect("/");
            }
            ViewBag.HasError = true;
            if (result.IsLockedOut)
            {
                ModelState.AddModelError("IsLockOut", "اکانت شما به دلیل ورود 5 بار ناموفق به مدت 5 دقیقه قفل شده است ");
                ViewBag.pageType = "1";
                return View("Index");
            }
            if (result.IsNotAllowed)
            {
                if (await _userManager.CheckPasswordAsync(await _userManager.FindByNameAsync(loginModel.lUserName), loginModel.lPassword))
                {
                    ModelState.AddModelError("IsNotAllowed", "ایمیل شما تایید نشده است");
                    ViewBag.pageType = "1";
                    return View("Index");
                }
            }
            ModelState.AddModelError("lUserName", "نام کاربری یا رمز ورود اشتباه است ");
            ViewData["returnUrl"] = ReturnUrl;
            ViewBag.pageType = "1";
            return View("Index");

        }
        [Route("/api/register")]
        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel registerModel)
        {
            if (ModelState.IsValid)
            {
                var user = new IdentityUser<int>()
                {
                    UserName = registerModel.rUserName,
                    Email = registerModel.rEmail,
                    EmailConfirmed = false,
                };
                var demo = await _userManager.CreateAsync(user, registerModel.rPassword);
                if (!demo.Succeeded)
                {
                    ViewBag.HasError = true;
                    foreach (var error in demo.Errors)
                    {
                        ModelState.AddModelError("", error.Description);
                    }
                    ViewBag.pageType = "2";
                    return View("Index");
                }
                var token = _userManager.GenerateEmailConfirmationTokenAsync(user);

                #region EmailBody
                string body = $"<h1>سلام {registerModel.rUserName} </h1><br/>" +
                        $"<h4> تشکر می کنیم که از پیام رسان پاشرز استفاده می کنید . <br/>" +
                        $" شما همچمنین می توانید از طریق راه های زیر با ما در ارتباط باشید <br/>" +
                        $"برنامه نویس :<br/>" +
                        $"آیدی ایتا : Mamin84 :<br/>" +
                        $"آیدی تلگرام : M_AminK :<br/>" +
                        $"دیزاینر :<br/>" +
                        $" آیدی تلگرام : @mmd_program </h4></br></br>" +
                        $"<h3><a href='{Url.Action("ConfirmEmail", "Account", new { username = user.UserName, token = token.Result }, Request.Scheme)}'>تایید ایمیل </a> </h3>";
                #endregion

                _emailSender.SendEmail(_emailInfo.Password, registerModel.rEmail, "تایید ایمیل", body, true, _emailInfo.Username, 25, _emailInfo.Address);


            }
            return View("RegisterSuccess");

        }
        public async Task<IActionResult> SignOut()
        {
            await _signinManager.SignOutAsync();
            return Redirect("/");
        }
        public async Task<IActionResult> ConfirmEmail(string username, string token)
        {
            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(token))
            {
                await _userManager.ConfirmEmailAsync(_userManager.FindByNameAsync(username).Result, token);
                return View();
            }

            return NotFound();
        }

        #region Validations
        public async Task<string> ValidateEmailAsync(string email)
        {
            if (await _userManager.FindByEmailAsync(email) != null || email == "" ||
                !Regex.IsMatch(email, @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")) return "is-invalid";
            return "is-valid";
        }

        public async Task<string> ValidateUserNameAsync(string username)
        {
            if (await _userManager.FindByNameAsync(username) != null || username == "" || !Regex.IsMatch(username, "^[A-Za-z0-9]*$")) return "is-invalid";
            return "is-valid";
        }

        public async Task<string> ValidatePasswordAsync(string password)
        {
            if (password == "" || !Regex.IsMatch(password, "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#%^&])[A-Za-z0-9@#%^&]{6,}")) return "is-invalid";
            return "is-valid";
        }
        #endregion


        #region Remotes
        public async Task<IActionResult> IsUserNameIsInUse(string rUserName)
        {
            if (await _userManager.FindByNameAsync(rUserName) != null) return Json($"این نام کاربری قبلاً وارد شده است");
            return Json(true);
        }
        public async Task<IActionResult> IsEmailInUse(string rEmail)
        {
            if (await _userManager.FindByEmailAsync(rEmail) != null) return Json($"این ایمیل قبلاً وارد شده است");
            return Json(true);
        }
        #endregion

    }
}
