# sleepfix

a next.js application for sleep health.

## about

this project investigates the claim that Vitamin C can counteract insomnia caused by adhd medications like Vyvanse or Adderall.

it provides a "sleep calculator" that simulates how Vitamin C timing and dosage might lower amphetamine levels in the body, potentially making it easier to sleep.

the simulation is based on pharmacokinetic models and allows users to adjust variables like medication dosage, body weight, and Vitamin C intake to see the potential impact on blood concentration levels over time.

i modelled the impact of acidifying your urine on Vyvanse elimination using the model from Huang W, et al. (2020, Journal of Pharmacology and Experimental).

this is a tool for exploration and education. it is not medical advice.

## getting started

it's available at [sleepfix.vercel.app](https://sleepfix.vercel.app)

this project uses NextJS and TailwindCSS.

## todo, maybe

- [ ] simulate the pharmacokinetics of other stimulant medications, including those which contain Methylphenidate.
- [ ] model the impact of other sleep-enhancement strategies.
- [ ] implement better graph components.
