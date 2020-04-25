using AutoMapper;
using Groceries.Common.Constants;
using Groceries.Common.Models;
using Groceries.Data.Models;
using Groceries.Data.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Groceries.Service.Services
{

    public interface IGroceryService
    {
        Task<IEnumerable<GroceryDto>> Sync(List<UpdateGroceryDto> groceries);        
    }
    public class GroceryService : IGroceryService
    {
        private readonly IMapper _mapper;
        private readonly IGroceryRepository _groceryRepository;

        public GroceryService(IMapper mapper, IGroceryRepository groceryRepository)
        {
            _mapper = mapper;
            _groceryRepository = groceryRepository;
        }

        public async Task<IEnumerable<GroceryDto>> Sync(List<UpdateGroceryDto> groceries)
        {

            Parallel.ForEach(groceries, async (grocery) =>
            {
                switch (grocery.Action)
                {
                    case GroceryActions.Delete:
                        var gro = await _groceryRepository.GetByUId(grocery.GroceryId);
                        if (gro != null && gro.ModifiedOn.Value.Ticks == grocery.ModifiedOn.Value.Ticks)
                        {
                            await _groceryRepository.DeleteByUId(grocery.GroceryId);
                        }
                        break;
                    case GroceryActions.Add:
                        var dbGrocery = _mapper.Map<Grocery>(grocery);
                        await _groceryRepository.Save(dbGrocery);
                        break;
                    case GroceryActions.Update:
                        var groc = await _groceryRepository.GetByUId(grocery.GroceryId);
                        if (groc != null)
                        {
                            groc.Checked = grocery.Checked;
                            groc.Description = grocery.Description;
                            await _groceryRepository.Save(groc);
                        }
                        break;
                    case GroceryActions.Nothing:
                    default:
                        break;
                }
            });

            return _mapper.Map<IEnumerable<GroceryDto>>(await _groceryRepository.GetAll());
        }
    }
}
