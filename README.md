# Pets

This document outlines a draft specification for interoperable pets in virtual worlds.

It also attempts to set the foundation to create future interoperable objects.

## Overview

The goal of this specification is to provide a simple, portable construct that describes a pet that can then be used across multiple platforms in an interoperable way.

The description of each pet must be platform-agnostic, capturing only essential information. This affords platforms the freedom to differentiate, innovate and express themselves independently, while still fostering collaboration at the interoperable level.

> The key to profound interoperability is to formalize the "essence" of an object, without going off the rails. It would be futile to have many identical platforms with zero differentiation. – Ashxn

## Spec

Each pet is described with a document written in JSON. JSON was chosen as a highly portable and well established format. It can easily exist as a standlone file or be embedded in databases, NFTs and other systems with minimal effort.

It's likely that interoperable objects other than pets will exist in the future. Because of this, we propose that pets are part of a very simple parent standard that allows future interop efforts to benefit from the foundations being made here:-

```json
{
  "type": "M3_pet",
  "version": "0.1.0"
}
```

Each spec requires just two core attributes plus the attributes applicable to that particular schema.

Platforms are then able to read these two fields and quickly determine whether they have support or not.

## Schema

Each document must conform to a well defined schema that describes essential information about the pet.

Platforms then use this information to form the basis of a pet in their virtual world, and enhance it with their own functionality, unique to each platform.

The following is an example pet document with a valid schema:

```json
{
  "type": "M3_pet",
  "version": "0.1.0",
  "name": "Wolf",
  "description": "A little blue wolf",
  "model": "https://domain.com/wolf.glb",
  "speed": 3,
  "near": 1,
  "far": 3,
  "emotes": [
    {
      "name": "Bark",
      "animation": "bark",
      "audio": "https://domain.com/bark.mp3"
    },
    {
      "name": "Flip",
      "animation": "flip",
      "audio": "https://domain.com/flip.mp3"
    }
  ]
}
```

## `type`

The spec that this document is adhering to. For pets this will always be `M3_pet`.

## `version`

The semver version of the pet schema being used.

## `name`

A short name for the pet, eg `Wolf`.

Each platform may use this in different ways. For example, in UI or as nametags above the pet, etc.

## `description`

A description of the pet.

Each platform may use this differently. For example, when inspecting a pet.

## `model`

A fully qualified URL to a gltf-binary file with the extension `.glb`. IPFS urls are not currently supported, but may be added in a future version.

The model may be built however the creator wants, with a few guidelines:

1. The model should be scaled to real-world units in meters
1. The scene origin is used as a ground reference point
1. Negative Z-axis is forward (if using blender)

In addition to this, each model MUST include:

1. An animation named `idle` that will be used when the pet is idle, eg standing and looking around
1. An animation named `move` that will be used when the pet is moving, eg walking, running or flying
1. An animation named `stay` that will be used when the pet has no objectives or has been ordered to stay, eg sitting or lying down
1. A mesh that includes `_hitbox` in its name, used to approximate the shape of the pet for interaction (use a fully transparent material for extra interop)

Models must also meet the performance [Limitations](#limitations).

## `speed`

The speed at which the pet moves, in meters per second. Generally this would be approximated to match the `move` animation speed.

## `near`

The near distance that the pet should stop at when following/reaching a target. This will vary depending on the size of the pet.

## `far`

The distance that a pets target must move away before the pet begins following it.

## `emotes`

Emotes are an optional extension to pets that platforms can choose to support.

Each platform may execute emotes differently, eg on a timer or when interacting with the pet.

Each emote includes:

1. (required) The `name` of the emote for use in UI
1. (required) The `animation` to play. The animation is played just once.
1. (optional) The URL of an `audio` clip to play. This must be a fully qualified URL to an `.mp3` file.

## Usage

Each platform can have their own requirements for how interoperable objects are spawned into their virtual worlds.

Some examples:

1. Allowing users to simply drag and drop a `.json` file directly into the world
1. Allowing users to paste a link to a `.json` file hosted somewhere online
1. Allowing users to click an upload button and select a `.json` file
1. Allowing users to see and use NFTs that contain a reference to a spec in their metadata

## Behavior

How the pet behaves inside each platform is up to them, but here is a basic example:

1. The pet spawns in front of its owner looking at them, using the `idle` animation
2. If the owner moves `far` from the pet, the pet starts to follow the owner, using the `speed` value and `move` animation
3. Once the pet gets `near` the owner again, the pet moves back to an `idle` mode
4. When the owner or someone else interacts with the pet, a random `emote` is chosen and executed
5. When the owner commands the pet to `stay`, the pet no longer follows its owner

While this gives you a rough idea of how the attributes can work together to form pet behavior, ultimately the choice is up to each platform. Some platforms may choose to have roaming pets with pathfinding or be powered by AI.

## Limitations

The ability to define custom UGC assets such as 3D models for a pet introduces a universal issue of performance.

It is fair to say that no platform (or engine) is able to support an infinite amount of compute, so it seems like it is in our best interest to introduce asset limitations.

These limitations will help foster the adoption of interoperable objects and allow them to be used across as many virtual worlds as possible:-

| Limitation | Maximum             |
| ---------- | ------------------- |
| Size       | 3 MB                |
| Bounds     | 3m x 3m x 3m        |
| Triangles  | 10,000              |
| Textures   | 2048 x 2048 (total) |
| Draw Calls | 2                   |
| Lights     | 0                   |

The limitations are intentionally strict for maximum adoption.

Some platforms may choose to raise their limits but creators should strive to meet them in order for their pets to be compatible across a larger number of platforms.

## Validation

We've included a simple [validation script](/validate.js) that can be used by platforms to validate that a document perfectly conforms to the pet spec.

## Examples

The [examples](/examples) folder includes example pets and assets.

---

## FAQ

### Why not use a new file extension like `.pet`?

There are only so many 3 to 4 letter file extensions that can exist in the world.

We think its best to be explicit and keep things simple.

Additionally, the spec itself is not intended to always be used as a file, and may be embedded in databases or NFT metadata.

### Why not use a GLTF extension?

While GLTF has fast become the most portable way to interoperate 3D models, there are a few reasons why we think its best to use JSON for spec files:

1. Not all interoperable objects require 3D models, and 3D models are not always the "main" focus of an interoperable object.
1. It's much easier for developers and creators to write a json file than it is to read/write a GLB extension. Anyone should be able to create their own pets easily.
1. Platforms should be able to determine support for an object BEFORE downloading all of the assets such as 3D models and audio etc.
1. JSON is universal while GLTF is still maturing. This also leaves the spec open to add support for future model formats.

### Why are there no skeleton requirements? / Why are animations embedded?

Unlike avatars, pets can vary widely and come in all different shapes and sizes. From a simple rock pet to an eight-legged octopus, each has the ability to have its own personality encoded into the model itself.

### Why can I not control the scale, offset or animation mappings via the json spec?

Clear separation of concerns. The `model` attribute points to a GLB model which defines all information relating to the 3D model itself.

While being able to overwrite these in the spec would be useful, it blurs the lines of responsibility and adds layers of indirection.

Emote animations are a quasi-exception to this rule, since pets can have a variable number of custom animations, they need to be explicitly defined in the spec itself.
