using System;
using System.Collections.Generic;
using System.Text;

namespace Groceries.Common.Models
{
    public class GroceryDto
    {
        public int GroceryId { get; set; }
        public bool Checked { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
