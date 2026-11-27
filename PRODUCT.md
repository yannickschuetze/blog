# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (server output, Node adapter) with MySQL, hosted on netcup Webhosting 4000 (Plesk, Node.js via Passenger). Posts are written in Markdown and stored in the database; there is no build step to publish. See DEPLOY.md.

## Users

Readers of a personal blog: people who know Yannick, and people who find a post or side project and want to know more. They arrive to read a story or look at a project, usually one post at a time, and occasionally to learn who is writing.

## Product Purpose

A personal blog where Yannick shares personal stories from life and writes about some side projects. Success means the writing is easy and pleasant to read, and the site stays easy for Yannick to keep publishing to.

## Positioning

The content is first-hand: Yannick's own life and own side projects. Nothing else on the site competes with the writing.

## Capabilities and Constraints

- All content is in German.
- Posts of two kinds in two separate sections: Geschichten (personal stories) and Projekte (side-project write-ups).
- Every post has a permanent number that is also its address (Nr. 14 lives at `/014/`).
- An About page (Über mich) introducing Yannick, and an RSS feed.
- An admin area at /admin with one fixed login, used mostly from a phone: write posts in Markdown, save drafts, preview, publish or withdraw, upload a drawing per post and images inside the text, manage the fixed drawing slots (home, sections, portrait, 404) and edit the About text.
- Uploads are PNG, JPEG or WebP only (no SVG), up to 12 MB.
- Deliberately out of scope for now: comments, analytics, newsletter, tags, search, dark mode.
- Open decisions: the blog's domain (SITE_URL).

## Brand Commitments

- Name: yannicksblog (working name).
- The owner asked for a simple, minimalistic design. This is binding.

## Evidence on Hand

None yet: no posts, photos, project material, or About text exist in the repository. Future work must not invent stories, projects, or biographical facts; use clearly marked placeholders until Yannick supplies the content.

## Product Principles

1. The writing is the product; everything else stays out of its way.
2. Simple over clever: fewer pages, fewer features, fewer decisions per visit.
3. Personal and honest: real stories and real projects, never filler.
4. Easy to keep writing: publishing a new post should take no more than writing it.
