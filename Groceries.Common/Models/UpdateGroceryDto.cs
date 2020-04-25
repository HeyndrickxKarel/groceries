using System;
using System.Collections.Generic;
using System.Text;

namespace Groceries.Common.Models
{
    public class UpdateGroceryDto : GroceryDto
    {
        public string Action{ get; set; }
    }
}
