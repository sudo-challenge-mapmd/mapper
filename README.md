# Seeing Sight

## **:tada: Winner of the Allia Serious Impact Hackathon November 2017 :tada:**

## Google Cardboard app for diagnosis and aid of Macular Degeneration

Our solution has three stages:
1. [Map the functional visual field](https://sudo-challenge-mapmd.github.io/mapper/)
2. [Show your family/friends what it's like to live with your condition](https://sudo-challenge-mapmd.github.io/mapper/stream.html)
3. [Warp a real-time camera feed to move images out of your blindspot](https://sudo-challenge-mapmd.github.io/mapper/car.html)

### Mapping the functional visual field

1. Place the phone in the google glasses and navigate to [here](https://sudo-challenge-mapmd.github.io/mapper/). 
2. Press start and look at the yellow dots in the center of the screen.
3. Tap the screen when you see a white dot.

We use a recursive algorithm investigate smaller and smaller grid sizes, narrowing down on the boundary between where you can detect the white dot and where you cannot.

![mapper](https://github.com/sudo-challenge-mapmd/mapper/raw/master/car.png)


