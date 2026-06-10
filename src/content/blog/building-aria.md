---
title: What building ARIA taught me about false alarms
description: Why a smoke sensor alone can't tell a fire from breakfast, and how fusing five sensors fixed it.
date: 2026-06-11
tags: [embedded, sensors, lessons]
---

When I started building ARIA, I assumed detecting fire was the easy part —
point an MQ-2 at the air and wait for the number to jump. The number jumped
all the time. Cooking, haze, a humid afternoon: everything looked like fire.

The fix wasn't a better sensor. It was *more* sensors disagreeing with each
other. A real fire raises smoke **and** carbon monoxide **and** drops
humidity. Steam raises smoke readings but raises humidity too. So ARIA scores
each signal, lets contradictory evidence subtract points, and only alarms when
the picture is consistent.

If you want to see what that feels like in practice, the
[ARIA project page](/projects/aria) lets you set the sensors yourself and
watch the score think.
