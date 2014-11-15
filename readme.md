#Email Network
## github地址：[Assignment2](https://github.com/vis2014/Assignment2).
##Dataset information
###1. Description
+ The network was generated using email data from a large European research institution. For a period from October 2003 to May 2005 (18 months) we have anonymized information about all incoming and outgoing email of the research institution. For each sent or received email message we know the time, the sender and the recipient of the email. Overall we have 3,038,531 emails between 287,755 different email addresses. Note that we have a complete email graph for only 1,258 email addresses that come from the research institution. Furthermore, there are 34,203 email addresses that both sent and received email within the span of our dataset. All other email addresses are either non-existing, mistyped or spam.

###2. Download address
+ http://snap.stanford.edu/data/email-EuAll.html

###3. Data preprocess
+ We select from the about 500 pairs of email connections from the dataset randomly to construct a JSON dataset. In JSON dataset, we construct nodes for both email sender and receiver. There is an edge for each email connection with the source is the sender and target is the receiver.

##Project Infomation
We use the social network to show the email connection between each person ( although we didn't achieve their name).
