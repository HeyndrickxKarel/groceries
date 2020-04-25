using Microsoft.AspNetCore.Http;
using Orbid.Common;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Groceries.Service.Services
{
    public class NetCoreIdentityResolverService : IIdentityResolverService<string>
    {
        private readonly IHttpContextAccessor _context;

        public NetCoreIdentityResolverService(IHttpContextAccessor context)
        {
            _context = context;
        }

        public Task<string> GetIdentity()
        {
            return Task.FromResult("Mobile app");
        }
    }
}
