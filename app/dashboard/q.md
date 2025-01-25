<!-- uestion (a):

A hard disk has 10 disks and 18 surfaces available for recording. Each surface is composed of 200 concentric tracks, and the disks rotate at 7200 rpm. Each track is divided into 18 blocks of 256 64-bit words. There is one R/W head per surface, and it is possible to read the 18 tracks of a given cylinder simultaneously. The time to step up from track to track is 1 ms (10 µs). Between data transfers, the head is parked at the outermost track of the disk.
(i) The total capacity of the floppy disk in KB

    Number of disks: 1010

    Number of surfaces per disk: 1818

    Total surfaces:
    10×18=180 surfaces.
    10×18=180surfaces.

    Number of tracks per surface: 200200

    Number of blocks per track: 1818

    Size of each block: 256 words×64 bits per word=16,384 bits per block=2048 bytes per block (2 KB)256words×64bits per word=16,384bits per block=2048bytes per block (2 KB).

The total capacity is:
Capacity=180×200×18×2048 bytes.
Capacity=180×200×18×2048bytes.

Convert to kilobytes:
Capacity in KB=180×200×18×20481024=1,296,000 KB.
Capacity in KB=1024180×200×18×2048​=1,296,000KB.
(ii) The maximum data rate in bits/second

    Rotational speed: 7200 rpm7200rpm.

    Rotational period:
    Time for one rotation=60 seconds7200 rotations=0.00833 seconds per rotation (8.33 ms).
    Time for one rotation=7200rotations60seconds​=0.00833seconds per rotation (8.33 ms).

    Data per rotation (from all surfaces):

Data per rotation=18 blocks per track×2048 bytes per block×8 bits per byte×18 surfaces.
Data per rotation=18blocks per track×2048bytes per block×8bits per byte×18surfaces.
Data per rotation=18×2048×8×18=5,308,416 bits.
Data per rotation=18×2048×8×18=5,308,416bits.

    Maximum data rate:

Maximum data rate=Data per rotationRotational period=5,308,4160.00833≈637,000,000 bits/second.
Maximum data rate=Rotational periodData per rotation​=0.008335,308,416​≈637,000,000bits/second.
(iii) The average access time in milliseconds

Average access time is the sum of the average seek time and the average rotational latency:
Rotational latency=Time for one rotation2=8.332=4.165 ms.
Rotational latency=2Time for one rotation​=28.33​=4.165ms.

    Seek time between two random tracks = 1 ms per track1ms per track.
    Assuming the average seek involves half the tracks:

Average seek time=2002×1=100 ms.
Average seek time=2200​×1=100ms.

Total average access time:
Average access time=Seek time+Rotational latency=100 ms+4.165 ms≈104.165 ms.
Average access time=Seek time+Rotational latency=100ms+4.165ms≈104.165ms.
(iv) Average transfer time when reading 256 blocks randomly

To read 256 blocks:
Transfer time per block=Rotational periodBlocks per track=8.3318≈0.463 ms.
Transfer time per block=Blocks per trackRotational period​=188.33​≈0.463ms.

For 256 blocks:
Total transfer time=256×0.463≈118.5 ms.
Total transfer time=256×0.463≈118.5ms.

Adding average access time:
Average total time=Access time+Transfer time=104.165+118.5=222.665 ms.
Average total time=Access time+Transfer time=104.165+118.5=222.665ms.
(v) Recording density (bits/inch)

    Outer track radius (roro​) and inner track radius (riri​) determine the track circumference.
    Use the given track density of 200 tracks/inch200tracks/inch.

Question (b):

Factors that determine drive performance:

    Rotational speed: Higher speed means faster data access.
    Seek time: Time taken to position the read/write head affects performance.
    Data transfer rate: Speed of transferring data from disk to the system.
    Cache size: Larger caches improve performance.
    Number of platters and surfaces: Increases data capacity and speed for simultaneous read/write.

Question (c):

Difference between SIMM and DIMM:

    SIMM (Single In-Line Memory Module):
        Has a single row of pins.
        Pins on both sides are connected, so only one side can be accessed at a time.
        Used in older systems.

    DIMM (Dual In-Line Memory Module):
        Has two rows of independent pins.
        Can access data on both sides simultaneously.
        Used in modern systems.

Major disadvantage of SIMM:

    Slower and less efficient than DIMM due to single data path and lower data transfer rates. -->