using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Groceries.Common.Models;
using Groceries.Service.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Groceries.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GroceryController : ControllerBase
    {
        private readonly IGroceryService _groceryService;

        public GroceryController(IGroceryService groceryService)
        {
            _groceryService = groceryService;
        }

        [HttpPost("Sync")]
        public async Task<ActionResult<IEnumerable<GroceryDto>>> Sync(List<UpdateGroceryDto> groceries)
        {
            var result = await _groceryService.Sync(groceries);
            return Ok(result);
        }
        
    }
}
