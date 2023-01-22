// Decompiled with JetBrains decompiler
// Type: Pushers.Startup
// Assembly: Pushers, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 5B3DEC07-3609-4CA7-A4E8-1B273E5DEB0D
// Assembly location: C:\Users\M.Amin\Desktop\Projects\Pushers\Pushers.dll
using System;
using Api.Hubs;
using Api.Models.ViewModels;
using EmailSender;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration) => this.Configuration = configuration;

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddSignalR();
            #region Injections

            services.AddScoped<Models.Context.AppDbContext, Models.Context.AppDbContext>();

            services.AddSingleton<IEmailSender, PleskMailSender>();
            #endregion

            #region Identity
            services.AddIdentity<IdentityUser<int>, IdentityRole<int>>(options =>
            {
                options.SignIn.RequireConfirmedEmail = true;
                options.User.RequireUniqueEmail = true;
            }).AddEntityFrameworkStores<Models.Context.AppDbContext>().AddDefaultTokenProviders()
            .AddErrorDescriber<CustomIdentity.PersianIdentityErrorDescriber.PersianIdentityErrorDescriber>();
            services.ConfigureApplicationCookie(options =>
            {
                options.LoginPath = "/account";
                options.ExpireTimeSpan = TimeSpan.FromDays(31);

            });
            #endregion

            #region DbConnection
            services.AddDbContext<Api.Models.Context.AppDbContext>(optionsAction: options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("Server"));
            });
            #endregion

            #region Email
            services.AddScoped<EmailInformation, EmailInformation>((arg) =>
            {
                return new EmailInformation()
                {
                    Username = Configuration.GetValue<string>("EmailConfiguration:Username"),
                    Address = Configuration.GetValue<string>("EmailConfiguration:Address"),
                    Password = Configuration.GetValue<string>("EmailConfiguration:Password")
                };
            });
            #endregion
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapControllerRoute(name: "default", pattern: "{controller=home}/{action=index}/{id?}");
                endpoints.MapHub<chatHub>("/chat");
            });

        }
    }
}
