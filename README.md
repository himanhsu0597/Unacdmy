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

# 1. Why did you choose that language ?

