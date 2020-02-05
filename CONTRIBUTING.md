# Contributing

Contributions are welcome, and they are greatly appreciated! Every little bit
helps, and credit will always be given.

## Get Started!
Ready to contribute? Here's how to set up `cdp/seattle` for local development.

1. Fork the `seattle` repo on GitHub.

2. Clone your fork locally:
    ```
    $ git clone git@github.com:{your_name_here}/seattle.git
    ```

3. Add remote:
    ```
    $ cd seattle/
    $ git remote add upstream https://github.com/CouncilDataProject/seattle.git
    $ git fetch upstream master
    ```

4. Install the project.
    ```
    $ npm i
    ```

5. Create a branch for local development:
    ```
    $ git checkout -b {your_development_type}/short-description
    ```

    Ex: feature/add-filters-to-search or bugfix/virtualize-transcript-search<br>
    Now you can make your changes locally.

6. To view your changes as you make them run:
    ```
    $ npm run start
    ```

7. When you're done making changes, check that your changes pass linting and tests
    ```
    $ npm run test
    $ npm run lint
    ```

8. Commit your changes and push your branch to GitHub.
    ```
    $ git add .
    $ git commit -m "Resolves gh-###. Your detailed description of your changes."
    ```
    If there are new commits from upstream's master since your last git pull, you need to merge the latest commits from upstream's master into your branch and resolve any merge conflicts locally. If there are no new commits from upstream's master, you can skip step a, b, and c.

    a. Get the latest commits:
    ```
    $ git checkout master
    $ git pull --rebase upstream master
    ```

    b. Merge the latest commits into your branch:
    ```
    $ git checkout {your_development_type}/short-description

    $ git rebase master
    or
    $ git merge master
    ```
    
    c. Resolve any merge conflicts.
    
    Push your branch to GitHub:
    ```
    $ git push origin {your_development_type}/short-description
    ```

9. Submit a pull request through the GitHub website.

10. Once your branch has been merged to master, if you want to keep your fork and local repo clean, you can delete your branch.
    ```
    $ git push origin --delete {your_development_type}/short-description
    $ git branch -D {your_development_type}/short-description
    ```
 
    Keep your local and fork repo's master up-to-date with upstream's master:
    ```
    $ git checkout master
    $ git pull --rebase upstream master
    $ git push origin master
    ```

## Deploying

Once your branch has been merged to master, GitHub will automatically deploy your changes to the live website.
