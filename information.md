### How authentication and route protection is working

passport.serializeUser() and passport.deserializeUser() handle the session management for user authentication. Here’s how it works:

#### passport.serializeUser(User.serializeUser()):

This function is used by Passport to decide what data about the user should be stored in the session. Typically, it stores a unique identifier for the user (like user.id).
The User.serializeUser() method provided by passport-local-mongoose (or similar libraries) handles this automatically, saving you from writing custom serialization logic.

#### passport.deserializeUser(User.deserializeUser()):

When the user makes subsequent requests, Passport looks up their session ID and deserializes it using deserializeUser().
This method retrieves the user's information from the session store (usually req.user), so you can access req.user throughout the request.
Together, these functions handle storing the user’s data in the session and retrieving it on each request.

Enabling Route Protection
With this setup, we can use req.isAuthenticated() to check if a user is logged in. In our code:

router.get("/new", (req, res) => {
if (!req.isAuthenticated()) {
req.flash('error', 'You must be signed in to make a post');
return res.redirect('/login');
}
res.render("campgrounds/new");
});
req.isAuthenticated() checks if there’s a valid user session. If not, the user is redirected to /login, and an error message is displayed.
If the user is authenticated, they can access the /new route and render the form.

//////////////////////

passport also provides .user in req.user where a object will be returned with a following field:

{
\_id: new ObjectId('67268161485bc4f638808ab9'),
email: 'example@gmail.com',
username: 'Tim John Bravo',
\_\_v: 0
}

//////

multer (a middleware ) makes it possible for handling multipart/form-data , which is primarily used for uploading files. It is written on top of busboy for maximum efficiency. NOTE: Multer will not process any form which is not multipart ( multipart/form-data ).

///

const index = async (req, res) => {
if (req.query.search) {

    const hasValidCharacters = /[a-zA-Z0-9]/.test(req.query.search);
    if (hasValidCharacters) {
      // Define the fuzzy search function
      const fuzzyMatch = (title, query) => {
        // Convert both title and query to lowercase for case-insensitive matching

        //Maple
        title = title.toLowerCase();

        //mpl
        query = query.toLowerCase();

        let titleIndex = 0;
        for (let queryChar of query) {
           Move through the title until we find the current character in query
          An example:
          query -> mop title -> maple
          0= maple.indexof(m,0); -> found at 0, title index becomes  1 (next index)
          1 = maple.indexof(p,1): -> found at 2, (maple) title index become 3 (next index)
          3= maple.indexOf(l,3): -> found at 3, (maple) title index become 4 (next index)
           no more left so the lop ends
         returns true
          // const campgrounds = allCampgrounds.filter(campground =>
          //fuzzyMatch(maple, mple)
            //);
          // is true, so the campground will be added to the array

          titleIndex = title.indexOf(queryChar, titleIndex);
          // If the character isn't found, return false
          if (titleIndex === -1) return false;
          // Move titleIndex forward for next character search
          titleIndex++;
        }
        return true;
      };

      // Fetch all campgrounds and filter using the fuzzyMatch function
      const allCampgrounds = await Campground.find({});
      const campgrounds = allCampgrounds.filter(campground =>
        fuzzyMatch(campground.title, req.query.search)
      );

      console.log(campgrounds);
      return res.render("campgrounds/result", { campgrounds });
    } else {
      return res.redirect('/campgrounds');
    }

} else {
const campgrounds = await Campground.find({});
const sortedCampgrounds = [...campgrounds].sort(
(a, b) => b.reviews.length - a.reviews.length
);
const slicedCampgrounds = campgrounds.slice(0, 6);

    const mostReviewed = sortedCampgrounds.slice(0, 8);
    const recentCampgrounds = [...campgrounds].reverse().slice(0, 9);

    res.render("campgrounds/index", {
      campgrounds: slicedCampgrounds,
      mostReviewed,
      recentCampgrounds,
    });

}
};
