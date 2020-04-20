# Unacdmy
I have implemented basic redis in Node JS

# What is Redis?
Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker. It supports data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps and much more.

Data structures are stored on the computer disk. So the Redis is Non-volatile.

# So in this assignment three .js files are present:
1. ds.js (implementation of all  internal data structures for first three command)
2. zs.js  (implementation of hashmap and skiplist for last three command)
3. redis.js (the main client server file containing all the functionalities)

# Running Redis
Download all the files ,put them in the folder,open the folder in terminal and type
 
 >node redis.js
 You will get the user interactive shell.
 
 # To Exit
 type exit and press enter
 
 > exit 

# Implementation
Lets dive into it

# 1. SET
Set key to hold the string value. If key already holds a value, it is overwritten, regardless of its type.
Time complexity: O(1)
Data structure : Hashmap. HashMap instances store key/value pairs allowing keys of any type.

# 2. GET
Get the value of key. If the key does not exist the special value nil is returned.
Time complexity: O(1)
Data structure : Hashmap.

# 3. Expire
Set a timeout on key. After the timeout has expired, the key will automatically be deleted. A key with an associated timeout is often said to be volatile in Redis terminology.

Return value
Integer reply, specifically:

1 if the timeout was set.
0 if key does not exist.

Time complexity: O(1)
Data structure : Two Hashmaps

# 4. ZADD
Time complexity:  O(log(N)) for each item added, where N is the number of elements in the sorted set.
Data Structure : Sorted Set (internally Hashmap + Skiplist)

# 5. ZRANGE
Returns the specified range of elements in the sorted set stored at key. The elements are considered to be ordered from the lowest to the highest score. 

Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
Data Structure : Sorted Set (internally Hashmap + Skiplist)

# 6. ZRANK
Returns the rank of member in the sorted set stored at key, with the scores ordered from low to high. The rank (or index) is 0-based, which means that the member with the lowest score has rank 0.

Time complexity: O(log(N))
Data Structure : Sorted Set (internally Hashmap + Skiplist)


#                                                 REPORT

> I chose Node JS because it helps in building a scalable and efficient Network Application.I was thinking about implementing socket connection but being short of time i couldn't get it done.Implementing Socket is easy and efficient in NODEJS.

> Following this could be done to make it more efficient
  > Making a Socket Connection
  > Making the operations more persistent
  > Implementing some Design Patterns and clean code.
  
> All the data structures used has been described in each operation above.Summarizing here
  > Hashmap ,because we can set and get data in O(1) time 
  > Sorted Set( Hashmap + Skiplist) as skiplist will help me in finding the rank in log(N) time.
 
> Yes, my operation support multithreading operation as whenever our server starts the whole data from  corresponding ".jrdb" files get loaded in our hasmap and sorted set and when we exit we again save this data back to files regardless of how many processes are using SET operation.
