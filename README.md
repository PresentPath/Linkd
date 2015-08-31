# Linkd
Share and discuss bookmarks!

[Mockup](https://linkd.mybalsamiq.com/mockups/3486949.png?key=0a9e3983347c60c76ed228db07e3c591114b25dc)

[![Circle CI](https://circleci.com/gh/PresentPath/Linkd.svg?style=svg)](https://circleci.com/gh/PresentPath/Linkd)


# Challenges

**Problem:** 
Asynchronous running of test spec files - During database testing, test spec files for the different models were being run asynchronously resulting in jumbled results output to the console. Also, the tests were being run before the database schema was fully loaded, resulting in a "Table doesn't exist" error. 

![mochaTestOutput](https://cloud.githubusercontent.com/assets/7910250/9267514/37235e50-4205-11e5-9758-a0e54d37457c.png)

**Solution:**
