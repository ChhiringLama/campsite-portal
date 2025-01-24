const fuzzyMatch = (title, query) => {
    // Convert both title and query to lowercase for case-insensitive matching
    
    //Maple
    title = title.toLowerCase();

    //mpl
    query = query.toLowerCase();

    let titleIndex = 0;
    for (let queryChar of query) {
      // Move through the title until we find the current character in query
      //An example:
      // query -> mop title -> maple
      //0= maple.indexof(m,0); -> found at 0, title index becomes  1 (next index)
      //1 = maple.indexof(p,1): -> found at 2, (maple) title index become 3 (next index)
      //3= maple.indexOf(l,3): -> found at 3, (maple) title index become 4 (next index)
      // no more left so the lop ends 
      //returns true 
      //  const campgrounds = allCampgrounds.filter(campground =>
      //fuzzyMatch(maple, mple)
      //  );
      // is true, so the campground will be added to the array
  
      titleIndex = title.indexOf(queryChar, titleIndex);
      // If the character isn't found, return false
      if (titleIndex === -1) return false;
      // Move titleIndex forward for next character search
      titleIndex++;
    }
    return true;
  };


  module.exports=fuzzyMatch;