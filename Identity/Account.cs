using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;

namespace Identity
{
    public class Account
    {
        private SignInManager<IdentityUser<int>> _signinManager;

        private UserManager<IdentityUser<int>> _userManager;

        public Account(SignInManager<IdentityUser<int>> signInManager, UserManager<IdentityUser<int>> userManager)
        {
            _signinManager = signInManager;
            _userManager = userManager;
        }

        public virtual async Task<int> LoginAsync(string UserName, string Password, bool RememberMe,
            bool lockout, Action onsuccess, Action onfail, Action notfounduser)
        {
            var result = await _signinManager.PasswordSignInAsync(UserName, Password, RememberMe, lockout);
            if (result.Succeeded)
            {
                //success = 1
                return 1;
            }
            if (result.IsLockedOut)
            {
                //failaur = 2
                return 2;
            }
            //not exsits user = 3
            return 3;
        }

        public virtual async Task<bool> RegisterAsync(string UserName, string Email, string Password)
        {
            var user = new IdentityUser<int>()
            {
                UserName = UserName,
                Email = Email,
                EmailConfirmed = false,
            };
            var demo = await _userManager.CreateAsync(user, Password);
            if (!demo.Succeeded)
            {
                //success
                return true;
            }
            //failaur
            return false;
        }
        public virtual async Task SignOutAsync()
        {
            await _signinManager.SignOutAsync()
        }
        public virtual async Task<bool> ConfirmEmailAsync(string username, string token)
        {
            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(token))
            {
                await _userManager.ConfirmEmailAsync(_userManager.FindByNameAsync(username).Result, token);
                return true;
            }
            return false;
        }
        public virtual async Task<string> GenerateConfirmEmail(IdentityUser<int> user)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            return token;
        }
    }
}
