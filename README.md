# CouncilDataProject - Seattle

[![Build Status](https://github.com/CouncilDataProject/seattle/workflows/Build%20and%20Deploy/badge.svg)](https://github.com/CouncilDataProject/seattle/actions)

A website for interacting with CouncilDataProject retrieved and generated data for the City of Seattle.

---

## About
We wondered why it was so hard to find out what was being discussed in Seattle City Council about a specific topic, so
we set out to solve that. The first step to this is basic data processing: automated transcript creation for city
council events, indexing those transcripts, and finally making them available on the web via our website and database.
We also wanted the entire system to aim to be low cost, modular, and open access, so that it would be relatively easy
for other CDP instances to be created and maintained. For us that means, databases and file stores are open access to
read from, the websites that users can interact with the data can be run on free hosting services such as GitHub Pages,
and computation choices should be flexible so that cost isn't a barrier issue.

The first CDP instance to be deployed was for Seattle (this repo!) and an example of the data that is produced and
available from these systems can be seen on our
[Seattle instance website](https://councildataproject.github.io/seattle/). The repository and code for the back-end
data processing can be found [here](https://github.com/CouncilDataProject/cdptools).

---

## Features
* Plain text search utility for events
* Complex filtering options for meeting discovery
* Info-rich pages for each city council meeting
    * Minutes with links to discussed items
    * Timestamped sentence transcripts
    * Voting for each event
    * Search transcript for keyword
    * Video of the event
* Voting records for any council member during CDP - Seattle's lifespan
* Share meeting at timepoint
* Variable meeting video playback rate

## Contributing
Contributions are welcome, and they are greatly appreciated! Every little bit
helps, and credit will always be given. See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.
