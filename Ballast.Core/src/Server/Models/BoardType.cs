using Ballast.Core.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace Ballast.Core.Models
{
    public class BoardType : StaticListTypeBase, IBoardType
    {

        public static BoardType Rectangle = new BoardType(value: 0, name: "Rectangle", centerOrigin: false );
        public static BoardType RegularPolygon = new BoardType(value: 1, name: "RegularPolygon", centerOrigin: true );
    
        public bool CenterOrigin { get; private set; }

        private BoardType(int value, string name, bool centerOrigin) : base(value, name) 
        {
            CenterOrigin = centerOrigin;
        }

    }
}