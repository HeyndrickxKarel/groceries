using AutoMapper;
using Groceries.Common.Models;
using Groceries.Data.Models;
using Orbid.Common;

using System;
using System.Collections.Generic;
using System.Text;

namespace Groceries.Service.Mapper
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Grocery, GroceryDto>().ReverseMap();
        }
    }
}
