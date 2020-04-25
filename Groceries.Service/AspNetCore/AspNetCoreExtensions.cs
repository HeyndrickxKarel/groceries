using AutoMapper;
using Dapper;
using Groceries.Data.Helpers;
using Groceries.Service.Mapper;
using Groceries.Service.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Orbid.Common;
using Orbid.Dapper;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace Groceries.Service.AspNetCore
{
    public static class AspNetCoreExtensions
    {
        public static IServiceCollection UseServices(this IServiceCollection services, string connectionString)
        {

            services.AddTransient<IMapper>(sp => new AutoMapper.Mapper(new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new MapperProfile());
            }), sp.GetService));

            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.TryAddSingleton<HttpClient>();
            services.AddTransient<IConnectionFactory>(provider => new ConnectionFactory(connectionString));
            services.AddTransient<IIdentityResolverService<string>, NetCoreIdentityResolverService>();

            #region Services
            services.AddTransient<IGroceryService, GroceryService>();

            services.InitializeDapper();
            #endregion
            return services;
        }
    }
}
