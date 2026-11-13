# Page bodies for _build/x_growth.py. Imported only from that script.
def add_pages(register, posts, paras, bullets, facts):

    # ---------- 1. Real estate agents ----------
    register(
        "niche",
        "x-post-ideas-for-real-estate-agents",
        "X post ideas for real estate agents",
        "Street-level listings, neighbourhood notes and buyer mistakes — without the empty 'just listed' post.",
        "X post ideas for real estate agents (with example posts) · Netmend",
        "X post ideas for real estate agents, with original example posts, neighbourhood tips, and a free in-browser writer. Adapt the structure; use only facts you can stand behind.",
        "X growth guides",
        "X post ideas for <span>real estate agents</span>",
        "A listing post that only says “just listed” is easy to scroll past. The posts that get saved and replied to on X are usually specific: a street, a constraint, a number you can defend, or a buyer mistake you see every month.",
        paras(
            "This page is for agents who already work a patch and want writing they can post without sounding like a brochure. It is not a lead-gen guarantee. Reach on X depends on the account, the timing and whether the post is actually useful. Use only addresses, prices and photos you have the right to publish, and never post a client’s private situation.",
            "The pattern that works for most agents is narrow and factual. Name the street or the building type, add one constraint (stairs, flood zone, leasehold, parking, school catchment), and leave a clean question for people who already live nearby. Soft marketing — “dream home”, “won’t last”, “DM me for the link” as the first line — tends to be ignored, especially from a new account.",
        )
        + "<h2>What to post instead of a slogan</h2>"
        + bullets([
            "<b>A listing with one constraint.</b> Price and beds are not enough. The useful line is the thing a buyer would otherwise only learn at the second viewing: the garden is north-facing, the kitchen is a galley, the service charge is £2,400 a year.",
            "<b>A street-level observation, not a market forecast.</b> “Two family houses on this terrace have sold in 11 weeks” is useful if it is true and dated. “The market is on fire” is not.",
            "<b>A buyer or seller mistake you can explain in four lines.</b> Offers subject to an unsold chain, skipping the survey, underestimating stamp duty, ignoring the lease length. No client names.",
            "<b>A walk-through detail.</b> The cupboard that holds the boiler, the room that does not fit a double bed, the bus that actually runs on a Sunday. These are the posts neighbours reply to.",
            "<b>A process post.</b> What happens between “offer accepted” and keys, in the order of your market, with typical time ranges you really see — and a note that every case is different.",
            "<b>Replies to local news.</b> A planning decision, a new bus route, a school catchment change. Add a street-level take, not a reshare with “thoughts?”.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + paras("All eight are written for a fictional agent in a real-looking neighbourhood. Change every fact before you post.")
        + posts([
            ("Concrete-fact hook",
             "This two-bed on Mapperley Road is £285,000, but the useful number is the service charge: £2,400 a year, and the lease has 82 years left.\n\nSecond-floor, no lift, one permit parking space in the next street. Floor plan is in the first reply."),
            ("Question + list",
             "If you are buying a flat in this building, look at these three lines before you fall for the kitchen photo:\n\n1. Lease length (this one: 82 years).\n2. Service charge for the last 3 years, not just this year.\n3. Whether the parking space is in the lease or a separate licence.\n\nI put the documents in the listing pack. Ask for them."),
            ("Short twist",
             "The “south-facing garden” on this listing is a 4-metre yard with a brick wall on the sunny side after 2pm.\n\nStill a good flat if you want the park at the end of the road. Just not the garden in the photo crop."),
            ("Process / lessons",
             "Three offers I saw accepted in this postcode last month, and what slowed them down:\n\n1. Buyer’s own flat not yet on the market.\n2. Survey flagged a flat roof; nobody had priced a repair.\n3. Solicitor started on the leasehold pack a week late.\n\nNone of these are unusual. Budget time for them."),
            ("Walk-through detail",
             "The second bedroom on Hartington Avenue takes a 140cm bed and a narrow wardrobe, not a double and a desk.\n\nIf you need a proper office, this is a one-bed with a box room. The living room, though, is the full width of the house."),
            ("Neighbourhood note",
             "The 45 bus on Sunday mornings is every 30 minutes from the stop at the end of this street, first one at 07:12.\n\nUseful if you actually have to get to the station, and easy to miss when the listing only says “close to transport”."),
            ("Very short hook",
             "Do not skip the survey on a 1930s terrace because the kitchen is new.\n\nThe kitchen does not tell you about the roof, the lintels or the damp in the rear wall."),
            ("Reply-style post",
             "A lot of first-time buyers in this area bid at the asking price and hope the chain is clean.\n\nAsk, in writing: is the seller buying? Is that purchase agreed? If it is not, your timeline is their timeline, not yours."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "Do not invent sold-price comparisons or “values have risen 12% on this street” unless you can point to a source and a date. Do not post interior photos of a property you do not have permission to show. Do not argue with other agents in public about a shared listing. And do not use the first line of a post to ask for a DM; put the invitation at the end, if you need it at all.",
            "If you want 10 variations of one listing in your usual tone, paste three or four of your old posts and the listing notes into the free X Post Writer. Read every draft against the brochure before you publish it. The tool will not check the lease, the price or the photos for you.",
        ),
        [
            ("Can I post a client’s house before it goes live on the portals?",
             "Only if you have the seller’s permission, in the form your firm already uses, and you follow any portal or franchise rules you are under. When in doubt, wait until it is publicly listed, or post a detail that does not identify the house."),
            ("Should I post every new listing?",
             "You can, but a feed of “just listed” photos with no constraint gets ignored. Rotate: one listing with a real constraint, one neighbourhood note, one process post. Quality beats a daily brochure."),
            ("Will these posts bring buyers?",
             "Sometimes a useful post is forwarded to a buyer. Often it just makes neighbours and other agents take you more seriously. Nobody can honestly promise leads from a template, including us."),
        ],
        ["x-hook-formulas", "how-to-write-x-posts-in-your-own-voice", "x-post-ideas-for-interior-designers", "x-bio-examples"],
    )

    # ---------- 2. Coaches ----------
    register(
        "niche",
        "x-post-ideas-for-coaches",
        "X post ideas for coaches",
        "Exercises, questions and frameworks — not vague motivation lines.",
        "X post ideas for coaches (with example posts) · Netmend",
        "X post ideas for life and business coaches, with original example posts and a free in-browser writer. No fake client results, no guaranteed outcomes.",
        "X growth guides",
        "X post ideas for <span>coaches</span>",
        "Motivational one-liners are cheap to write and easy to ignore. Coaches who get useful conversations on X usually post a question they actually ask, a short exercise, or a named framework with steps, and they keep client stories anonymous or clearly fictional.",
        paras(
            "This is for coaches (life, career, business, executive) who need a public writing habit that does not invent testimonials. It is not medical, therapy or financial advice, and it is not a promise that posting will fill a practice. If a story is based on real work, strip every detail that could identify the person, or use a clearly labelled example.",
            "The posts that tend to get replies are the ones a reader can use in the next ten minutes: a prompt, a distinction, a mistake you see often, or a short sequence. “Believe in yourself” does not give them anything to do.",
        )
        + "<h2>Specific ideas that fit coaching work</h2>"
        + bullets([
            "<b>The question you ask in session.</b> Write the question, why you ask it, and what a shallow answer sounds like. No client transcript.",
            "<b>A two-minute exercise.</b> Timed, concrete, with a stop rule. “Write the decision you are avoiding in one sentence, then write the cost of waiting 90 days.”",
            "<b>A named distinction.</b> Busy vs important, advice vs accountability, a goal vs a weekly behaviour. Give the names and one example of each.",
            "<b>A framework with three to five steps</b> you actually use, not a reused internet model you cannot explain.",
            "<b>A boundary or packaging post.</b> What you do not coach, how you work, how long a typical engagement is, without pressure copy.",
            "<b>A correction of a slogan</b> in your field, with a more precise version you stand behind.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Question + list",
             "When someone says “I need more confidence”, I ask three things before we talk about confidence at all:\n\n1. What decision is sitting in your drafts?\n2. Who would be affected if you made it this month?\n3. What have you already tried, in order?\n\nConfidence is often a label on a delayed decision."),
            ("Concrete exercise",
             "A ten-minute exercise I use when a plan is vague:\n\nWrite the outcome in one sentence.\nWrite the first visible action that would take under 30 minutes.\nWrite what you will stop doing this week to make room for it.\n\nIf you cannot name the stop, the plan is still a wish."),
            ("Short twist",
             "Accountability is not a pep talk.\n\nIt is a date, a definition of done, and a person who will ask whether it happened. If any of the three is missing, it is just a conversation."),
            ("Lessons from work",
             "Five career-change conversations in a row stalled in the same place: the person could describe the job they wanted, but not a two-hour test they could run this month.\n\nI now start there. A test you can finish beats a five-year plan you cannot touch."),
            ("Distinction",
             "Advice is “here is what I would do”.\nCoaching, the way I practise it, is “here is the decision in front of you, and the questions that make it sharper”.\n\nIf you want a consultant, say so. The two jobs get messy when they are sold as the same thing."),
            ("Boundary post",
             "I do not coach acute anxiety, couples in crisis, or anyone looking for a diagnosis.\n\nThose need a clinician. If that is you, I will say so and stop. The work I take is decisions, habits and the stories people tell about their work."),
            ("Very short hook",
             "If your goal has no weekly behaviour, it is a mood.\n\nPick the behaviour first. The goal can wait a week."),
            ("Framework",
             "When a client is stuck on a “should”, I use this sequence:\n\n1. Who installed the should?\n2. What does it cost to keep it?\n3. What would you do if it were optional?\n4. What is the smallest public test of that answer?\n\nWe do not skip to step 4. The first two questions do most of the work."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "Do not invent client results, income figures or “I helped her 10x her business” stories. Do not give the impression that a post replaces therapy, clinical care or regulated advice. Do not argue with a stranger’s trauma in public. And do not open with “DM me if you want this for yourself”; if you offer a call, put the terms in a reply or a link in your bio, after the useful part.",
            "To get 10 drafts in your usual tone, paste a handful of your old posts and one idea into the free X Post Writer. Then cut anything that sounds like a result you cannot prove.",
        ),
        [
            ("Can I tell a client story?",
             "Only in a form that cannot identify the person, and only if your contract and professional rules allow it. When in doubt, write a clearly labelled fictional example, as we do on this page."),
            ("Is motivation ever worth posting?",
             "A precise line can work as a hook. It is rarely enough on its own. Add a question, a step, or a distinction, or it is just decoration."),
            ("Will this fill my calendar?",
             "It might start conversations. It might not. A writing habit is not a sales funnel by itself, and we do not claim otherwise."),
        ],
        ["x-hook-formulas", "x-post-ideas-for-consultants", "x-post-ideas-for-course-creators", "how-to-get-more-replies-on-x"],
    )

    # ---------- 3. SaaS founders ----------
    register(
        "niche",
        "x-post-ideas-for-saas-founders",
        "X post ideas for SaaS founders",
        "Changelogs in plain language, pricing decisions and the feature you turned off.",
        "X post ideas for SaaS founders (with example posts) · Netmend",
        "X post ideas for SaaS founders: changelog posts, pricing notes, build-in-public updates and original examples. No fake MRR screenshots.",
        "X growth guides",
        "X post ideas for <span>SaaS founders</span>",
        "“Excited to announce” is a press release, not a post. Founders who get useful distribution on X usually write the decision behind a ship: what changed, who it is for, what they turned off, and a number they can actually show.",
        paras(
            "This page is for people shipping a product, whether it is at $0 or long past it. It is not a playbook for fake build-in-public. If you post a revenue, user or churn figure, it should be one you would also stand behind in a due-diligence room. If you cannot, leave the number out and describe the decision.",
            "The useful SaaS post is often a small, dated change plus the reason. A vague “we have been working hard on reliability” does less than “we cut the webhook retry window from 24 hours to 90 minutes, because support tickets were about delayed events, not failed ones.”",
        )
        + "<h2>Post types that fit a product company</h2>"
        + bullets([
            "<b>A changelog in spoken language.</b> What a user can do now that they could not do on Monday, and who should care.",
            "<b>A pricing or packaging decision</b> and the failed alternative. People reply when you show the trade-off, not the price table alone.",
            "<b>A feature you removed</b>, and the support volume or complexity that justified it.",
            "<b>A support pattern.</b> The ticket you keep getting, the docs you rewrote, the default you changed.",
            "<b>A constraint of the product</b> you will not pretend to cover. Honesty here is more useful than a feature matrix.",
            "<b>A short build log</b> with a date, a commit-sized unit of work, and what is still broken. No fake “day 47: $12,440 MRR” graphics.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "We turned off CSV export of raw webhook logs today.\n\nIt was used by 11 accounts, and two of them were exporting 4 million rows at a time, which froze the workspace for everyone else. If you still need a dump, there is a dated export job under Settings → Data, limited to 90 days."),
            ("Question + list",
             "If you are choosing a billing tool this quarter, these are the three questions I would ask before the demo:\n\n1. Can you change a price without breaking existing invoices?\n2. What happens when a tax rate changes mid-cycle?\n3. Who owns the failed-payment emails — you or the tool?\n\nWe picked the boring answers, not the prettiest dashboard."),
            ("Short twist",
             "We delayed the public API by six weeks so we could remove a field.\n\nThe field was “plan_name”. It looked harmless. It would have locked our packaging to strings we already want to change. The API now returns plan IDs only."),
            ("Changelog",
             "Shipped this morning: you can now require approval from a second person before a workspace deletes a production dataset.\n\nIt is off by default. Turn it on under Settings → Safety. We added it because two customers asked after a close call, not because it looks good on a comparison page."),
            ("Support pattern",
             "The ticket we answered 40 times in October was not a bug. People were pasting an API token into the “workspace ID” field.\n\nWe relabelled the field, added an example value, and rejected tokens with a specific error. Tickets dropped. The docs were not enough."),
            ("Pricing decision",
             "We are not adding a $9 “lite” plan.\n\nWe modelled it. It would have moved the accounts that already write in for discounts, and it would have split support into two products we cannot staff. The starter plan stays at $29, with a 14-day trial, no card on day one."),
            ("Very short hook",
             "If your churn email apologises twice, rewrite it.\n\nSay what will be deleted, when, and how to export. That is the whole job of the email."),
            ("Build log",
             "Week of 10 November: we replaced the home-rolled queue with the one our host already runs.\n\nResult so far: retry visibility is better, and we lost the custom dashboard I liked. We still have a backlog of delayed jobs from the old system to drain. I will post when that number is zero, not before."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "Do not post someone else’s revenue screenshot style with made-up numbers. Do not dunk on a named competitor with claims you have not measured. Do not announce a waitlist with no description of the product. And do not use “we 10x’d conversions” without the baseline, the date range and what else changed in the same week.",
            "Paste a ship note and a few of your old posts into the free X Post Writer if you want 10 tones of the same changelog. Then check every figure against your dashboard.",
        ),
        [
            ("Should I post MRR every week?",
             "Only if the number is real, you are at ease with it being copied, and you can explain the movement. A weekly vanity graph without context trains people to ignore you. A dated decision is usually more useful."),
            ("Is build-in-public required?",
             "No. Plenty of serious products are quiet. If you do it, be consistent about what you will and will not share, especially customer names and unreleased security issues."),
            ("Can the writer invent feature copy for me?",
             "It can draft. It can also invent a feature you did not ship. Read the draft against the release. The tool does not see your codebase."),
        ],
        ["x-post-ideas-for-indie-hackers", "x-hook-formulas", "how-to-write-a-viral-x-thread", "x-post-ideas-for-startup-founders"]
        if False else
        ["x-post-ideas-for-indie-hackers", "x-hook-formulas", "how-to-write-a-viral-x-thread", "how-to-write-an-x-thread"],
    )

    # ---------- 4. Freelancers ----------
    register(
        "niche",
        "x-post-ideas-for-freelancers",
        "X post ideas for freelancers",
        "Rates, scope, contracts and the work itself — not a daily hustle diary.",
        "X post ideas for freelancers (with example posts) · Netmend",
        "X post ideas for freelancers: how to post about rates, scope, process and finished work, with original examples. No fake income screenshots.",
        "X growth guides",
        "X post ideas for <span>freelancers</span>",
        "A freelance feed that only says “available for work” or “just hit my best month” is hard to hire from. The posts that get serious replies are usually about scope, rates, process, or a piece of work you can actually show.",
        paras(
            "This is for independent designers, developers, writers, illustrators, editors and similar trades. It is not a promise that posting will replace a sales pipeline. If you mention money, use figures you would also put in a proposal. If you mention a client, you need their permission, or you talk about the work in a way that does not identify them.",
            "Useful freelance posts tend to teach a buyer how to brief you, or teach a peer how you run the job. “I am taking on two more retainers in January” can work as a last line. It is a weak first line.",
        )
        + "<h2>What is worth posting</h2>"
        + bullets([
            "<b>A scope boundary</b> you now write into contracts, and the mess that taught you to add it.",
            "<b>How you price</b> a common job, in ranges, with what is in and out. Not a fake “I charge $10k for a logo” flex unless that is true.",
            "<b>A before-and-after of the brief</b>, not only of the pixels: the questions you asked, the constraint you added.",
            "<b>A process post:</b> discovery, draft, revision cap, delivery files, what happens if the project pauses.",
            "<b>A red-flag list</b> for both sides — late briefs, unpaid “quick calls”, revision loops with no cap.",
            "<b>A finished piece</b> with the constraint (deadline, brand rules, accessibility, budget) that shaped it.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "My website redesigns start at $4,800 for a five-page marketing site, written in the proposal as: homepage, three inner pages, a contact form, and two rounds of revisions.\n\nCMS training, extra templates and a blog index are quoted separately. I would rather say this here than discover it on a call."),
            ("Question + list",
             "If you are hiring a freelancer this month, put these four lines in the brief before you ask for a price:\n\n1. What already exists (files, CMS, brand).\n2. What “done” looks like, in deliverable files.\n3. The drop-dead date, and why.\n4. Who signs off — one name, not a committee.\n\nI can quote from that. I cannot quote from “we need a refresh”."),
            ("Short twist",
             "I stopped offering unlimited revisions.\n\nUnlimited sounds generous. It usually means the brief was never finished. I now write “two rounds” in the statement of work, and a day rate after that."),
            ("Lessons from work",
             "Three projects that went wrong last year had the same first week: a kickoff call, no written brief, and a “we will know it when we see it” on taste.\n\nI now send a one-page brief back to the client for a yes before I open the file. If they cannot approve the brief, we do not start."),
            ("Process",
             "For a copywriting job I do this, in order:\n\n1. A 45-minute kickoff and a written outline you approve.\n2. First draft, then one structured revision.\n3. Final files in Google Docs and Markdown.\n\nIf legal needs a pass, we add it at the outline stage, not after the “final” draft."),
            ("Red flags",
             "I no longer take a “quick call” with no agenda from a stranger who found me on X.\n\nSend five lines: the job, the deadline, the budget range, and whether this is a one-off or a retainer. If that feels like too much writing, we are not a match."),
            ("Very short hook",
             "A low rate with a vague scope is not a bargain.\n\nIt is how both sides end up resenting the work."),
            ("Work sample post",
             "Last month I rewrote a pricing page for a B2B tool. The constraint was: no new screenshots, no invented case studies, and the three plans had to stay as they were.\n\nMost of the work was cutting adjectives and putting the limits (seats, log retention, support hours) in the same order on every plan. That is the job, even when it does not look flashy."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "Do not post someone else’s invoice or a mocked “$32k month” screenshot. Do not name a difficult client. Do not use a competitor’s client as a public case study. And do not turn every thread into a pitch; if people like your process posts, they can follow the link in your bio.",
            "The free X Post Writer can turn one brief or one scope note into 10 drafts in your tone. Check the prices and the deliverables before anything goes live.",
        ),
        [
            ("Should I post my rates publicly?",
             "If your rates are stable and you are comfortable with peers seeing them, a clear range saves everyone time. If they vary a lot by client, describe how you price instead of a single number."),
            ("How do I show work without naming the client?",
             "Talk about the constraint and the artefact: the page, the illustration, the feature. Ask the client first if the brand would be recognisable. When in doubt, wait for written permission."),
            ("Does posting every day bring clients?",
             "Sometimes a post starts a conversation; often it does not. Treat X as a public notebook and a place to be findable, not as a replacement for direct outreach you already do."),
        ],
        ["x-post-ideas-for-consultants", "x-post-ideas-for-web-designers", "how-to-write-x-posts-in-your-own-voice", "x-bio-examples"]
        if False else
        ["x-post-ideas-for-consultants", "x-post-ideas-for-course-creators", "how-to-write-x-posts-in-your-own-voice", "x-bio-examples"],
    )

    # ---------- 5. Dentists ----------
    register(
        "niche",
        "x-post-ideas-for-dentists",
        "X post ideas for dentists",
        "Plain-language explanations and clinic habits — never a patient’s face or a miracle claim.",
        "X post ideas for dentists (with example posts) · Netmend",
        "X post ideas for dentists and dental clinics: educational posts, appointment habits and original examples. No patient photos, no miracle claims.",
        "X growth guides",
        "X post ideas for <span>dentists</span>",
        "Dental posts that work in public are usually explanations, not before-and-after marketing. People ask questions about pain, waiting, what a treatment actually involves, and how to avoid an emergency. They ignore slogans, and they should ignore any post that promises a perfect smile on a deadline.",
        paras(
            "This page is for dentists, hygienists and clinic managers writing for a general audience. It is not clinical advice, and it is not a substitute for an examination. Do not post radiographs, clinical photos or stories that could identify a patient. Do not promise outcomes, speed or pain-free treatment you cannot guarantee. Follow the advertising rules that apply to you in your country.",
            "The useful pattern is: name the situation, say what you usually look for, say when someone should call, and stop there. Leave room for “this is general information; your own teeth need their own exam.”",
        )
        + "<h2>Ideas that stay on the right side of the rules</h2>"
        + bullets([
            "<b>A plain-language explanation of a common procedure</b> (a filling, a hygienist visit, a root canal in outline), with what the patient will be asked to do afterwards.",
            "<b>A habit post:</b> how long to wait after a child has a sugary drink, why night guards are fitted, what “sensitive to cold” can mean — without diagnosing a stranger.",
            "<b>How your clinic runs:</b> emergency slots, late-cancellation rules, what to bring, whether you accept a particular plan — facts, not pressure.",
            "<b>A myth you still hear</b>, corrected in one paragraph, with a note that cases differ.",
            "<b>Prevention that is specific</b>, not “brush twice a day” on its own: interdental brushes around a bridge, fluoride toothpaste and a pea-sized amount for children, when a sports mouthguard is worth it.",
            "<b>A signpost.</b> Swelling, a knocked-out tooth, uncontrolled bleeding: tell people to seek urgent care, not to wait for your content.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "If a permanent tooth is knocked out, the advice we give on the phone is: pick it up by the crown, not the root, rinse it briefly with milk or saline if it is dirty, and try to put it back in the socket. If you cannot, keep it in milk and get to urgent dental care immediately.\n\nThis is general first aid, not a treatment plan. Time matters."),
            ("Question + list",
             "Before a child’s first filling, parents usually ask me these three things:\n\n1. Will they need local anaesthetic? Often yes, and we explain how it feels.\n2. Can they eat afterwards? Soft food until the numbness has gone, so they do not bite their lip.\n3. Will it look silver? That depends on the material we agree with you.\n\nNone of this replaces the conversation in the chair."),
            ("Short twist",
             "“I only came because it stopped hurting” is a sentence I hear too often.\n\nPain that disappears is not always a problem that has disappeared. If a tooth was severe and then went quiet, it is worth an exam, not a wait-and-see on social media."),
            ("Clinic process",
             "We keep two emergency slots on weekday mornings for regular patients with acute pain or swelling.\n\nCall, do not post. If those slots have gone, we will tell you whether to wait, come to the afternoon, or go to urgent care. A message on X is not a booking."),
            ("Myth correction",
             "Bleeding gums are not “just because you brush too hard” by default.\n\nSometimes the brushing is too abrasive. Sometimes it is inflammation. The only honest next step is to have a look, not to switch toothbrushes on a guess from a post."),
            ("Habit post",
             "If you have a bridge or tight contacts, floss alone may not be enough.\n\nAsk your hygienist to show you an interdental brush size that actually fits. The size matters; a brush that does not pass the contact does no work."),
            ("Very short hook",
             "A knocked-out adult tooth is an urgent problem, not a morning-after problem.\n\nMilk, do not let the root dry, and get to urgent dental care."),
            ("Explanation",
             "A routine hygienist visit here is not “just a polish”.\n\nWe look at gums, plaque, and any sites that bleed, then clean what we can see and feel, and we will tell you if something needs a dentist. It is not a cosmetic extra we added for the sake of it."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "No patient photos, even with a blur, unless you have proper consent and it is allowed. No “smile makeover in a week” promises. No diagnosing a stranger from a comment. No invented five-star stories. If you want drafts, use the free X Post Writer, then have a clinician in the practice read them before they go out.",
        ),
        [
            ("Can we post reviews?",
             "Only real ones, with the permission and wording your regulator and the review site allow. Never write a review yourself and pretend a patient wrote it."),
            ("Is X a good place for appointment reminders?",
             "No. Bookings, medical history and reminders belong in your proper clinic channels. Use X for general education and public information about how the clinic works."),
            ("Who should approve these posts?",
             "A registered clinician in the practice, not only the marketing person. If a draft over-promises, cut it."),
        ],
        ["x-post-ideas-for-therapists", "how-to-write-x-posts-in-your-own-voice", "x-bio-examples", "x-hook-formulas"],
    )

    # ---------- 6. Restaurants ----------
    register(
        "niche",
        "x-post-ideas-for-restaurants",
        "X post ideas for restaurants",
        "Today’s dish, a supplier, a booking rule — not stock photos and “open for lunch”.",
        "X post ideas for restaurants and cafes (with example posts) · Netmend",
        "X post ideas for restaurants, cafes and bars: specials, suppliers, booking rules and original example posts. No fake reviews.",
        "X growth guides",
        "X post ideas for <span>restaurants</span>",
        "“Open for lunch, book now” is a sign on the door, not a post. Restaurant accounts that people actually follow usually post something you can only know if you work there: today’s special, a supplier, a change to hours, or a honest note about waiting times.",
        paras(
            "This is for restaurants, cafes, bakeries and bars. It is not a paid-ads plan and it will not fill every table. If you show a plate, use a photo you took today, not a stock image from another kitchen. If you mention a price, it should still be true at service. Do not invent reviews or queue photos.",
            "The useful cadence is small and frequent: one fact about food or hours, posted when you can also reply to a booking question. A monthly brand film does less, for this job, than a Tuesday note that the stew has sold out.",
        )
        + "<h2>What to post from a kitchen or a pass</h2>"
        + bullets([
            "<b>Today’s special, with the constraint.</b> “We have 18 portions of the mackerel, lunch only, £16.” A real limit is more interesting than an adjective.",
            "<b>A supplier or a produce note</b> you can name: the farm, the fish, the bakery that sends the bread on Thursdays.",
            "<b>A change to hours, menus or allergy information</b> — dated, and repeated in the usual booking channel too.",
            "<b>A booking rule</b> people get wrong: Saturday deposit, walk-in bar seats, how long you hold a table.",
            "<b>A behind-the-pass detail</b> that is not staff humiliation: why a dish is off, why a cake only appears on Fridays.",
            "<b>A local, specific invitation</b> (match days, a neighbouring gallery’s opening night) rather than “happy hour vibes”.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "Lunch special today: grilled mackerel, new potatoes, the fennel salad. £16. We have 18 portions and we will not 86 it quietly — when it is gone, this post will say so.\n\nKitchen opens at 12:00. No reservation needed for the counter."),
            ("Question + list",
             "If you are booking Saturday dinner here, three things that help us:\n\n1. A deposit of £10 a head, returned on the bill.\n2. Tell us allergies in the booking, not at the table.\n3. We hold a table for 15 minutes, then we release it to the people who are waiting.\n\nThe book is at the usual link in the bio."),
            ("Short twist",
             "We took the cheesecake off the menu this week.\n\nThe cream cheese we trust is not available until next Tuesday, and I will not swap in a brand I have not tasted. The tart is still on. Sorry if you came for the cheesecake; it will be back when the cheese is."),
            ("Supplier note",
             "The tomatoes on the lunch salad this week are from a greenhouse in Formby, picked yesterday.\n\nThey are not pretty enough for a stock photo. They taste of something, which is why they are on the plate."),
            ("Hours change",
             "We are closing at 15:00 this Thursday, 19 November, for a staff meeting.\n\nBreakfast and lunch as usual. Dinner service starts again on Friday at 18:00. If you already have a Thursday evening booking, we have written to you."),
            ("Sold-out post",
             "The mackerel is gone for today.\n\nThe soup and the pork schnitzel are still on. Kitchen until 14:30."),
            ("Very short hook",
             "Walk-ins: we keep six seats at the bar for dinner, no reservation.\n\nYou may wait. We will tell you the honest time, not a hopeful one."),
            ("Dish explanation",
             "The stew on Wednesday is the same recipe we have used since we opened: beef shin, beer, onions, five hours.\n\nIt is not a “new drop”. It is on Wednesdays because that is the day we have time to cook it properly. £14, with bread."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "Do not buy fake reviews or post a plate from a previous season as if it were today’s. Do not argue with a public complaint about food safety in a sarcastic tone; take it offline and deal with it. Do not show staff in a way they have not agreed to. Use the free writer for drafts of specials and booking rules, then have the person who runs the floor check the times and prices.",
        ),
        [
            ("Should we post every special?",
             "If the fact is true and you can update the post or reply when it sells out, yes. A stale special is worse than silence."),
            ("Can we ask people to tag us?",
             "You can invite it. Do not badger a guest at the table for a photo, and do not repost a guest’s photo without their okay."),
            ("Will this replace booking ads?",
             "It can help regulars and neighbours. It is not a paid media plan, and empty Tuesday nights usually need more than a witty post."),
        ],
        ["x-post-ideas-for-photographers", "x-hook-formulas", "best-time-to-post-on-x", "x-content-calendar-ideas"],
    )

    # ---------- 7. Photographers ----------
    register(
        "niche",
        "x-post-ideas-for-photographers",
        "X post ideas for photographers",
        "The constraint, the light and the brief — not a feed of uncaptioned JPEGs.",
        "X post ideas for photographers (with example posts) · Netmend",
        "X post ideas for photographers: how to caption work, explain a brief, and post rates or process. Original examples, no fake awards.",
        "X growth guides",
        "X post ideas for <span>photographers</span>",
        "A beautiful frame with no caption is easy to like and hard to hire from. Photographers who get useful conversations on X usually write the constraint: the light, the brief, the lens, the time they had, or the thing the client asked them not to do.",
        paras(
            "This is for portrait, wedding, documentary, commercial and editorial photographers. Get permission before you post a recognisable person, a private home, or a job a client has not cleared. Do not invent awards, magazine credits or “shot for a famous brand” if it is not true. Do not watermark someone else’s picture.",
            "The caption is part of the work in a text-first feed. Say what the picture will not show: the weather, the five-minute window, the fact that the product had to stay unopened.",
        )
        + "<h2>Captions and posts that do some work</h2>"
        + bullets([
            "<b>The constraint.</b> Ten minutes on a station platform, mixed strip lights, a child who did not want to sit. That is more useful than “loved this shoot”.",
            "<b>A technical note in plain language.</b> Why you chose available light, why you moved, why this lens. Not a gear flex for its own sake.",
            "<b>A process post:</b> how you brief, how many images a couple actually receives, when the gallery lands, how you handle raw files.",
            "<b>A usage post.</b> What a personal print licence is vs a campaign licence, in one paragraph.",
            "<b>An edit decision.</b> Why you cropped, why you left a colour cast, why the “hero” is not the smiliest frame.",
            "<b>Availability and rates</b> as facts, when you are ready to say them, not as a teaser.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "This portrait was made in eight minutes, under the platform lights at a commuter station, on a 50mm, no flash.\n\nThe brief was: “I have a train at 18:12 and I do not want a studio.” We did four poses and left. Full series up on the site, with the client’s okay."),
            ("Question + list",
             "If you are hiring a photographer for a campaign, put these in the brief before you ask for a day rate:\n\n1. Where the images will run (web, print, paid ads, packaging).\n2. How long you need the licence.\n3. Whether you need the raw files (my default is no).\n4. The drop-dead delivery date.\n\nUsage is most of the price. The day rate is the rest."),
            ("Short twist",
             "The sharpest frame from this wedding is not the one I would print.\n\nThe one I would print is slightly soft, because she had just seen her father. I will always show both, and I will say which one I stand behind."),
            ("Process",
             "A standard wedding set with me is: a pre-wedding call, coverage from getting ready to the first part of the evening, and a gallery of 400–600 edited photographs within four weeks.\n\nAn album, a second shooter and extra hours are quoted separately. I put all of this in the contract, not in a story."),
            ("Edit decision",
             "I left the green of the fluorescent lights in this shop portrait on purpose.\n\nCorrecting it to “neutral” made the place look like a studio. The job was to show where she actually works."),
            ("Usage",
             "A personal licence, the way I write it, covers your website, your social accounts and prints for your home or office.\n\nIt does not cover paid ads, stock libraries, or selling the image on merch. If you need that, we write a campaign licence with a term and a territory. Ask before you run ads."),
            ("Very short hook",
             "If the only direction on the brief is “make it pop”, I will send it back.\n\nTell me where the picture has to live, and what must be readable at the size it will be used."),
            ("Permission note",
             "I do not post photographs of children from a family session unless a parent has said so in writing, for this use.\n\nThis frame is used here with that permission. If you asked me not to post, I will not post, even when the picture is the one I like most."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "Do not drag another photographer’s work for engagement. Do not post a sneak from a wedding the couple asked you to keep quiet. Do not use a “before” of a person that would embarrass them. Draft captions in the free X Post Writer if you want, then check names, licences and whether the file is cleared.",
        ),
        [
            ("Should I post every job?",
             "Only the ones you have clearance for, and only if you have something to say about the constraint or the use. A grid of uncaptioned work is a portfolio; a text feed needs a sentence."),
            ("Can I name the client?",
             "When they have agreed. Some brands will want a legal pass. Some families will want no public post at all. Default to asking."),
            ("Does gear content work?",
             "A tool note attached to a real job can be useful. A naked unboxing rarely helps you get hired."),
        ],
        ["x-post-ideas-for-interior-designers", "x-post-ideas-for-authors", "x-hook-formulas", "how-to-write-x-posts-in-your-own-voice"],
    )

    # ---------- 8. Lawyers ----------
    register(
        "niche",
        "x-post-ideas-for-lawyers",
        "X post ideas for lawyers",
        "Plain explanations of a process, not legal advice in a reply thread.",
        "X post ideas for lawyers (with example posts) · Netmend",
        "X post ideas for lawyers and legal practices: process explainers and original examples. Not legal advice, no client details, no outcome promises.",
        "X growth guides",
        "X post ideas for <span>lawyers</span>",
        "People look to lawyers on X for a clearer picture of a process: what happens first, what a document is for, what a deadline means. They should not be given personal legal advice in a public thread, and you should not give it.",
        paras(
            "This page is for solicitors, attorneys and legal practices writing in public. It is information about process, not advice, and it is not a retainer. Do not post anything that could identify a client or a matter. Do not promise outcomes. Follow the publicity and confidentiality rules of your regulator and your firm. If a question needs advice, say so and take it into a proper client channel.",
            "The useful post names a jurisdiction, dates the information, explains one step, and stops before the “apply this to your case” line.",
        )
        + "<h2>What is usually safe and useful to post</h2>"
        + bullets([
            "<b>A process explainer</b> in one jurisdiction: how a claim usually starts, what a case management conference is, what “without prejudice” is for — in plain language.",
            "<b>A document map.</b> What a particular form is, who files it, what it is not.",
            "<b>A deadline reminder</b> that is general (for example, a well-known filing season) with a date and a source, plus “check your own position”.",
            "<b>How your firm actually works:</b> who the first call is with, whether you do fixed fees for a named service, what you do not handle.",
            "<b>A change in a public rule</b>, linked to an official source, summarised without spin.",
            "<b>A correction of a common mix-up</b> (criminal vs civil, employee vs contractor) with no punchline at a stranger’s expense.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "In England and Wales, “without prejudice” on an email is not a magic shield for everything you say.\n\nIt is a label that can protect genuine settlement discussions from being shown to the court as admissions. It does not hide a threat, and it does not replace advice on your own matter. If you are unsure, ask your solicitor before you hit send."),
            ("Question + list",
             "If you are about to sign a consumer contract, these are the three clauses I suggest people actually read, slowly:\n\n1. How either side can end it, and how much notice.\n2. What you are liable for if you cancel early.\n3. Which country’s courts and law it names.\n\nThis is general information, not a review of your contract. If the numbers are large, get advice."),
            ("Short twist",
             "A template contract is not “free” if nobody has checked it against the job in front of you.\n\nThe risk sits in the definitions, the liability cap, and the ending clauses. Those are the pages I am asked to look at most often."),
            ("Process",
             "For a straightforward will, the way we usually work is: a first meeting, a draft you read in your own time, then a signing we supervise.\n\nWe will tell you the fee before we start. We do not take instructions for a will over a public reply on X. Write to the practice, or telephone the number on the site."),
            ("Jurisdiction note",
             "Employment status (employee, worker, self-employed) is not something you can settle with a job title on a business card.\n\nIn this jurisdiction it depends on the real working relationship. The official guidance is the starting point; your own facts may need advice. I will not diagnose a stranger’s status in the comments."),
            ("What we do not do",
             "This practice does not handle criminal defence or family law.\n\nIf that is what you need, we will say so quickly and, where we can, point you to a directory of solicitors who do. We would rather send you away than take a matter we do not run."),
            ("Very short hook",
             "A deadline on a court letter is not a suggestion.\n\nIf you have one, speak to a solicitor in your jurisdiction the same day. Do not wait for a social media answer."),
            ("Rule change",
             "A public consultation on a proposed change to the small-claims limit closed last week. The government’s official page is the source, not a thread. (Example of the shape; cite the real paper if you post this live.)\n\nI will post a short, dated note if and when the rule actually changes. Until then, the current rule is the one that applies."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "No war stories that identify a matter, even if you think the details are obscure. No “we always win these”. No legal advice in a reply. No dunking on a litigant in person. Have a partner or compliance lead look at a draft if you are unsure. The free writer can help with tone; it cannot check the law.",
        ),
        [
            ("Can I answer a specific question in the comments?",
             "You can explain a general process and then stop. Personal advice belongs in a client engagement, after a conflict check. Say that clearly."),
            ("May I name a judgment?",
             "Public judgments are public. Still be careful with parties’ personal data, and do not imply you acted when you did not. Link the official report if you cite one."),
            ("Is this marketing regulated?",
             "In many places, yes. Follow your regulator’s publicity rules. This page is not a substitute for them."),
        ],
        ["x-post-ideas-for-accountants", "x-post-ideas-for-consultants", "x-bio-examples", "how-to-write-x-posts-in-your-own-voice"],
    )

    # ---------- 9. Personal trainers ----------
    register(
        "niche",
        "x-post-ideas-for-personal-trainers",
        "X post ideas for personal trainers",
        "Sessions, regressions and habits — not body-shaming or miracle transformations.",
        "X post ideas for personal trainers (with example posts) · Netmend",
        "X post ideas for personal trainers and coaches: session ideas, regressions and habits, with original examples. No fake transformations, no medical claims.",
        "X growth guides",
        "X post ideas for <span>personal trainers</span>",
        "Transformation photos and “shred in six weeks” lines are the most common posts in this industry, and the least trustworthy. Trainers who earn attention on X usually post a regression, a session structure, a habit that can be done without a gadget, or a clear limit of what they are qualified to say.",
        paras(
            "This is for personal trainers, strength coaches and similar fitness professionals. It is not medical advice. Do not diagnose, do not prescribe diets you are not qualified to prescribe, and do not post a client’s body without explicit permission. Do not invent before-and-after results or promise a weight or a time.",
            "Write the session, the regression, and the person it is for (a beginner, a runner coming back from a break, someone with a sore knee who has already seen a clinician). Leave the rest to the programme you actually sell offline.",
        )
        + "<h2>Useful post types</h2>"
        + bullets([
            "<b>A session in outline:</b> the main lift or movement, the sets you actually use, the rest, and a regression.",
            "<b>A form cue</b> in one sentence, attached to a movement, not a dunk on a stranger’s video.",
            "<b>A habit post</b> that does not require a supplement: steps, protein at breakfast if that is in your scope, sleep, walking on rest days.",
            "<b>A return-to-training note</b> after illness or a break (general, conservative, “get cleared if you need to”).",
            "<b>How you work:</b> in-person or online, how long a block is, what you need from a new client (PAR-Q, a recent session history).",
            "<b>A limit.</b> What you refer out: pain, eating disorders, medical conditions.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "Today’s beginner strength session, 45 minutes:\n\n1. Goblet squat, 3×8, 90 seconds rest.\n2. Chest-supported row, 3×8.\n3. Split squat holding the rack, 3×6 each side.\n4. Carry, 3 trips of 20 metres.\n\nIf the goblet squat is unstable, we swap a sit-to-stand to a box. That is the session, not a secret programme."),
            ("Question + list",
             "If your knees complain on lunges, I usually check these three things (after you have seen a clinician if the pain is sharp or new):\n\n1. Can you do a split squat holding a rack, shorter range?\n2. Do you have enough room to stay upright?\n3. Are you adding load before you can control the descent?\n\nI will not diagnose you on X. If it hurts in a way that worries you, get it looked at."),
            ("Short twist",
             "You do not need a new programme every Monday.\n\nYou need the same handful of movements, loaded a little more carefully, for long enough to see whether they are working. A new PDF is not progress."),
            ("Regression",
             "If a press-up at the floor is a collapse, we do not “just do more of them”.\n\nWe raise the hands to a bench or a rail, keep a straight line from head to heels, and earn the floor later. The raised press-up is still a press-up."),
            ("Habit",
             "A rest-day walk is part of the plan I write, not an optional extra.\n\nTwenty to thirty minutes, easy pace, outside if you can. It is not a punishment for missing the gym, and it does not need a tracking badge."),
            ("Scope limit",
             "I am a personal trainer, not a physiotherapist or a doctor.\n\nIf you have unexplained pain, dizziness, chest pain, or a condition you have not had cleared for exercise, I will ask you to speak to a clinician before we train. That is the job, not a refusal to help."),
            ("Very short hook",
             "If the warm-up is the only time your hips feel organised, the warm-up is doing work the session should also do.\n\nWe keep a couple of those drills and we put them in the work sets, lighter, until they stick."),
            ("How I work",
             "A typical block with me is 12 weeks, once or twice a week in the room, plus a short plan for the days I do not see you.\n\nI ask for a recent training history and a health screen first. I do not take on “get a holiday body in 21 days”. We can talk about a date; we will not invent a timeline."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "No body-shaming, no “no excuses”, no supplement miracle claims, no client photos without permission, no form-shaming a stranger’s video. Use the free writer for session copy if you want, then check that every regression is one you would actually coach.",
        ),
        [
            ("Can I post client results?",
             "Only with permission, only real numbers, and without implying everyone will get the same outcome. Prefer talking about the programme rather than someone’s body."),
            ("Is a daily workout post enough?",
             "It can help. It is stronger if you add who it is for and a regression. A raw list of exercises is easy to scroll past and easy to do badly."),
            ("Should I argue about nutrition online?",
             "Stay inside your qualification. Refer out when the question is medical or clinical. Public fights about diets rarely help your clients."),
        ],
        ["x-post-ideas-for-coaches", "x-post-ideas-for-therapists", "x-content-calendar-ideas", "x-hook-formulas"],
    )

    # ---------- 10. Accountants ----------
    register(
        "niche",
        "x-post-ideas-for-accountants",
        "X post ideas for accountants",
        "Deadlines, records and what you need from a client — dated, and never as personal tax advice.",
        "X post ideas for accountants (with example posts) · Netmend",
        "X post ideas for accountants: deadline reminders, record-keeping and process posts, with original examples. Not personal tax advice.",
        "X growth guides",
        "X post ideas for <span>accountants</span>",
        "Clients do not need a joke about tax season as much as they need a dated reminder, a list of records, or a clear picture of how you work. Accountants who write well on X stay general, name the jurisdiction, and refuse to do someone’s tax in the comments.",
        paras(
            "This is general information, not tax, audit or accounting advice. Rules change. Name the tax year and the country, link an official source when you cite a date or a threshold, and tell people to check their own position with their adviser. Do not post client data, not even as a “sanitised” screenshot.",
            "The useful post is often a checklist or a process: what to keep, when to send it, what you will not file without. Humour is fine if it is kind and does not punch down at people who are scared of the paperwork.",
        )
        + "<h2>Post types that help, and stay general</h2>"
        + bullets([
            "<b>A dated deadline</b> with the official name of the obligation and a link to the authority, plus “this may not be your date if your facts differ”.",
            "<b>A records list</b> for a common situation (a first year of self-employment, a simple limited company, a rental property) without claiming it is complete for everyone.",
            "<b>How your firm works:</b> what a bookkeeping pack looks like, when you need it, whether you work on a fixed fee for a named service.",
            "<b>A software or process note</b> — bank feeds, receipt capture — as a method, not a sponsored claim unless it is one.",
            "<b>A myth correction</b> (“I can put my whole holiday through the company”) without humiliating the person who asked.",
            "<b>A capacity post</b> if you are closing the books for new clients this quarter, with what “complete records” means.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "If you are a self-assessment taxpayer in the UK and you file online, the 31 January deadline is the one most people mean — but it is not the only date that matters, and it can be different if you have other obligations.\n\nCheck your own account on the official site, or ask your accountant. I will not confirm a stranger’s deadline in a reply."),
            ("Question + list",
             "If this is your first year trading as a sole trader, these are the records I usually ask people to start keeping from day one:\n\n1. Sales, with invoices or a simple sales list.\n2. Purchases, with receipts.\n3. Bank statements for the business account.\n4. A note of money you put in or took out.\n\nThis is a starting list, not a complete set of rules for every trade. Ask your adviser."),
            ("Short twist",
             "A shoebox of receipts in April is not a bookkeeping system.\n\nA monthly export from your bank and a folder of invoices, even a rough one, will save you more money than a clever workaround."),
            ("Process",
             "For year-end with us, we ask for the bookkeeping pack eight weeks before your filing date: bank statements, sales and purchase listings, payroll reports if you have them, and a note of anything unusual.\n\nIf the pack arrives late, we will tell you, early, whether the date is still realistic. We would rather have that conversation in week one than in week eight."),
            ("Myth correction",
             "“I can run my personal shopping through the company if I take it out later” is a sentence that causes mess.\n\nWhat you may or may not put through a company depends on the rules and on your facts. Treat personal and business spending as separate, and ask your accountant before you invent a method."),
            ("Capacity",
             "We are not taking on new limited-company clients for a 31 January filing this close to the date.\n\nIf you already have complete records and you need a name for next year, write to the practice with a short description of the business. A public reply on X is not a client acceptance."),
            ("Very short hook",
             "If you cannot find last year’s accounts, start with the official filing record and your bank statements, not with a spreadsheet you might have made.\n\nThen call your accountant. Guessing the numbers is how errors get filed."),
            ("Software note",
             "A bank feed is useful, and it is not the same thing as a reviewed set of books.\n\nSomeone still has to match transfers, pick up missing invoices and ask you about the odd payments. That is the work we mean when we say “bookkeeping”, not the fact that the bank is connected."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "No client screenshots, no “here is how I would file your situation”, no made-up savings figures, no joking about evading tax. Have a qualified person in the firm read drafts that mention dates or thresholds. The free writer can help you say it more clearly; it does not know this year’s rules.",
        ),
        [
            ("Can I quote a threshold or a rate?",
             "Yes if you take it from an official source, date it, and warn that it may not apply to the reader. Do not quote a rate from memory if you would not put it in a letter."),
            ("Is a weekly tax tip worth it?",
             "If it is accurate and general, yes. A wrong tip is worse than silence. A short process post ages better than a number that will change."),
            ("Should I argue with bad tax advice on X?",
             "You can point to the official page, once, calmly. A long fight rarely helps the people you actually act for."),
        ],
        ["x-post-ideas-for-lawyers", "x-post-ideas-for-financial-advisors", "x-post-ideas-for-consultants", "x-content-calendar-ideas"],
    )

    # ---------- 11. Consultants ----------
    register(
        "niche",
        "x-post-ideas-for-consultants",
        "X post ideas for consultants",
        "The diagnostic, the trade-off and the scope — not a thought-leadership cliché.",
        "X post ideas for consultants (with example posts) · Netmend",
        "X post ideas for independent consultants: diagnostics, trade-offs and scope posts, with original examples. No fake case-study metrics.",
        "X growth guides",
        "X post ideas for <span>consultants</span>",
        "“Thought leadership” that could have been written by anyone in your industry is easy to produce and easy to skip. Consultants who get serious replies on X usually post a diagnostic question, a trade-off they made on a job, or a clear description of what is in and out of scope.",
        paras(
            "This is for independent and small-firm consultants (operations, strategy, HR, IT, marketing, and similar). Do not invent case-study percentages. Do not name a client unless you have permission. Do not give the impression that a 200-character post is a diagnosis of a company you have not seen.",
            "Write as if a sharp peer is reading: the constraint, the option you rejected, and how you would tell whether the work is done.",
        )
        + "<h2>Post types that sound like real work</h2>"
        + bullets([
            "<b>A diagnostic question</b> you ask in week one, and why a vague answer is a problem.",
            "<b>A trade-off.</b> Speed vs completeness, a pilot vs a full rollout, a tool vs a process change.",
            "<b>A definition of done</b> for a common engagement, in observable terms.",
            "<b>A scope boundary</b> you now write into proposals, and the overrun that taught you.",
            "<b>A method note</b> (how you interview, how you sample, how you report) that a buyer can recognise.",
            "<b>What you will not take on</b>, professionally, without drama.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "In the first week of an operations review I ask for the last 20 incidents, not the last slide deck about incidents.\n\nDecks describe the system people wish they had. The tickets describe the one they have. If there is no list, that is already a finding."),
            ("Question + list",
             "Before you hire a consultant for a “transformation”, I would want written answers to these:\n\n1. What will be true in six months that is not true now?\n2. Who has the authority to say no to a workstream?\n3. What will you stop doing to make room for this?\n4. How will you tell, in numbers you already track, that it worked?\n\nIf those cannot be answered, the project is still a slogan."),
            ("Short twist",
             "A 60-page report is sometimes the least useful thing I can leave behind.\n\nA two-page decision memo, the data behind it, and a meeting with the person who can actually decide: that is often the work. I will still write the long appendix if you need it for a board, but it is not the product."),
            ("Trade-off",
             "We recommended a four-week pilot in one warehouse rather than a 12-site rollout.\n\nThe client wanted the big bang, because the board date was fixed. The pilot found a labelling problem that would have been copied 12 times. I will keep making this argument, even when it is unfashionable."),
            ("Scope",
             "My proposals now say, in writing: I do not run the client’s internal comms, and I do not sit as an unofficial manager of their staff.\n\nI will design the work, run the workshops we agreed, and hand over the artefacts. If you need an interim manager, that is a different contract."),
            ("Definition of done",
             "For a pricing project, “done” for me is: a documented price list, the rules for exceptions, an owner of those rules, and a first month of invoices that follow them.\n\nA workshop and a slide are not done. They are a start."),
            ("Very short hook",
             "If nobody in the room can name the decision the workshop is meant to produce, I will cancel the workshop.\n\nWe can meet when the decision is written down, even if the answer is still blank."),
            ("What I will not take",
             "I do not take “come and motivate the team” as a brief.\n\nI will look at the system they work in: targets, tools, hand-offs, staffing. If the brief is only a pep talk, I am the wrong hire."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "No invented “we saved them 30%”. No naming a client’s mess. No dunking on a named company you did not work with. Use the free writer to get 10 versions of a diagnostic post, then cut any figure you cannot source.",
        ),
        [
            ("Should I post frameworks I use with clients?",
             "Yes if they are yours to share and they do not expose a client’s data. A named sequence with steps is more useful than a 2×2 you never use."),
            ("Is a newsletter better than X?",
             "They do different jobs. X is a public notebook and a place to be found. A newsletter is for people who already want more. You can point from one to the other without turning every post into a signup ad."),
            ("Will this replace business development?",
             "It can support it. It is not a substitute for conversations with people who already know your work."),
        ],
        ["x-post-ideas-for-freelancers", "x-post-ideas-for-saas-founders", "x-post-ideas-for-coaches", "how-to-write-an-x-thread"],
    )

    # ---------- 12. Ecommerce founders ----------
    register(
        "niche",
        "x-post-ideas-for-ecommerce-founders",
        "X post ideas for ecommerce founders",
        "Stock, shipping and the product itself — not a daily discount code.",
        "X post ideas for ecommerce founders (with example posts) · Netmend",
        "X post ideas for ecommerce and shop founders: shipping, stock, product stories and original examples. No fake reviews or invented sales figures.",
        "X growth guides",
        "X post ideas for <span>ecommerce founders</span>",
        "A shop account that only posts discount codes trains people to wait for a code. Founders who get useful attention usually post the product constraint, a shipping fact, a restock date, or a decision about packaging, returns or a supplier.",
        paras(
            "This is for independent shops and small ecommerce brands. If you quote a sales number, it should be real. If you show a review, it should be a real customer who agreed to be quoted. Follow the advertising and consumer rules that apply to you (including how you talk about discounts, stock and delivery times).",
            "The useful post often answers a pre-purchase question: when it ships, what the fabric does, how a return works, why a colour is delayed.",
        )
        + "<h2>Posts that help a shop, not just a sale</h2>"
        + bullets([
            "<b>A product fact</b> that is not in the first line of the product page: shrink, fit, origin, a limit of the material.",
            "<b>A shipping or customs note</b> that is current, especially at peak season.",
            "<b>A restock or a discontinuation</b>, with a date or a “we will not make this colour again”.",
            "<b>A returns or repairs policy</b> in plain language.",
            "<b>A supplier or workshop note</b> you can stand behind, without a fairy-tale origin story.",
            "<b>A decision:</b> why you will not rush a pre-order, why you raised a price, why a SKU is gone.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "The navy merino jumper shrinks if you tumble it. We say so on the care label and on the product page, and I am saying it here too.\n\nCold wash, flat dry. If you want a machine-tough knit, the cotton crew is the one."),
            ("Question + list",
             "If you are ordering from us for a mid-December delivery in the UK, these are the cut-offs as they stand today:\n\n1. Standard post: order by 16 December.\n2. Next-day (weekdays): order by 3pm on 22 December.\n3. We do not offer guaranteed 24 December delivery.\n\nIf the courier changes this, we will update the page and this account. Check the checkout, not an old post."),
            ("Short twist",
             "We are not putting this bag back into production in yellow.\n\nThe dye lot we trusted is gone, and the substitute was a different colour in daylight. Better to retire it than to pretend it is the same bag."),
            ("Returns",
             "You have 30 days from delivery to return an unused item with its tags, in the official returns bag, for a refund to the original payment method.\n\nSale items are included. Made-to-order belts are not. The full wording is on the returns page; this post is the short version, not a rewrite of the terms."),
            ("Supplier note",
             "The leather for the belts comes from a tannery we have visited, in the same region as the workshop that cuts them.\n\nI will not call it “sustainable” as a slogan. I will tell you where it is made and what it is made of. The workshop address is on the product page."),
            ("Price decision",
             "The canvas tote goes from £28 to £32 on 1 December.\n\nThe cloth went up, and I would rather change the price than change the cloth. Orders placed before that date are at £28. I am saying it now so it is not a surprise."),
            ("Very short hook",
             "If the estimated ship date in checkout says 10 days, it is 10 days.\n\nWe do not “leave a little extra” in the estimate. If we are late, we write to you."),
            ("Restock",
             "The size 8 of the black ankle boot is back, 40 pairs, arriving on Thursday and going on the site when they are on the shelf.\n\nThere is no waitlist email this time; the last one was more noise than it was worth. If you want them, Thursday."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "No fake urgency, no invented “selling out”, no purchased reviews, no before-and-after that is just a filter. Draft product and shipping posts with the free writer if you want, then check every date and price against the shop.",
        ),
        [
            ("Should I post every new SKU?",
             "Post the ones where you have something to say: a fit note, a limit, a story about the material. A catalogue dump is what the shop is for."),
            ("Can I run a discount from X?",
             "Yes if the code works, the dates are true, and the terms are clear. A code that fails is worse than no code."),
            ("Do I need a separate brand account?",
             "If the founder’s voice and the shop’s voice are different, maybe. If you are small, one honest account is enough. Do not split your attention for the sake of it."),
        ],
        ["x-post-ideas-for-saas-founders", "x-post-ideas-for-photographers", "x-content-calendar-ideas", "x-hook-formulas"],
    )

    # ---------- 13. Financial advisors ----------
    register(
        "niche",
        "x-post-ideas-for-financial-advisors",
        "X post ideas for financial advisors",
        "Process and definitions, never a personal recommendation in public.",
        "X post ideas for financial advisors (with example posts) · Netmend",
        "X post ideas for financial advisors and planners: process explainers and original examples. Not personal financial advice, no performance promises.",
        "X growth guides",
        "X post ideas for <span>financial advisors</span>",
        "People look to advisors on X for definitions and process: what a pension wrapper is, how an annual review works, what “advice” means in your jurisdiction. They should not receive a personal recommendation in a public thread.",
        paras(
            "This is general information, not personal financial advice. Do not recommend a product, a stock, a crypto asset or a withdrawal in public. Do not promise returns. Do not use a client’s situation, even anonymised, if it could still be recognised. Follow your regulator’s marketing and promotion rules. If you are not allowed to promote certain products, do not.",
            "The useful post explains a term, a document, or a step in how you work, then stops. “This depends on your own circumstances; take regulated advice before you act” is not decoration. It is the point.",
        )
        + "<h2>What is usually appropriate to post</h2>"
        + bullets([
            "<b>A definition</b> (ISA vs general account, a workplace pension vs a personal one — in your country), dated, with an official source where a rule is cited.",
            "<b>How a first meeting works</b> at your firm, what you will ask for, what you charge or how you are paid, if you are allowed and willing to say it.",
            "<b>A document checklist</b> for a planning conversation (not a solicitation to hand over data on X).",
            "<b>A reminder to review named life events</b> (a child, a house, a job change) without a product push.",
            "<b>A correction of a common mix-up</b>, calmly, without dunking.",
            "<b>What you do not do</b> (day trading tips, crypto calls, “get me 12%”).",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "A workplace pension and a personal pension are not interchangeable just because both have the word “pension” in the name.\n\nCharges, investment choices, employer contributions and how you take money later can all differ. This is a general distinction, not advice on your pots. If you are transferring anything, get regulated advice or official guidance first."),
            ("Question + list",
             "For a first planning meeting, I usually ask people to bring or have to hand:\n\n1. Recent pension and investment statements.\n2. A list of debts and the interest rates, if they know them.\n3. Any protection policies and the cover amounts.\n4. A rough picture of income and essential spending.\n\nSend those through the firm’s proper channel, not in a direct message on X."),
            ("Short twist",
             "A high past return is not a plan.\n\nA plan, the way I use the word, is a set of actions and reviews that still make sense if the next decade is dull. I will not tell a stranger on here what that plan is for them."),
            ("How we work",
             "We are a regulated firm. We charge a disclosed fee for advice, which we will put in writing before you agree to anything.\n\nWe do not give product recommendations on this account. If you want to talk, use the contact path on our website so we can do the checks we are required to do."),
            ("Life event",
             "A new job is a sensible moment to look at the pension you are leaving and the one you are joining.\n\nLook at charges, contributions, and whether you need regulated advice before you move anything. I will not tell you, in a comment, to transfer or to stay. The official guidance services in this country exist for a reason."),
            ("What I will not do",
             "I will not comment on a stock, a coin, or a “hot” product on this account.\n\nI will also not look at a screenshot of your portfolio in a public reply and tell you what to sell. That would not be advice worth having, and it would not be allowed."),
            ("Very short hook",
             "If someone promises you a return, that is a sales line, not a plan.\n\nAsk how they are paid, and what happens if the number is wrong."),
            ("Definition",
             "“Emergency fund” is a useful idea and a sloppy phrase.\n\nI use it to mean cash you can reach without selling a long-term investment, sized to your own essential spending. How many months is a personal question. I will not give you a number in a thread."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "No performance charts as marketing unless your rules allow them and they are fair, clear and not misleading. No “clients like you made 8%”. No tips. Have compliance read anything that might be a financial promotion. The free writer can tidy language; it cannot make an unauthorised promotion legal.",
        ),
        [
            ("Can I talk about the market?",
             "You can talk in general terms if your rules allow it. You cannot turn a market comment into a personal recommendation. When in doubt, say less and link official explanations."),
            ("May I use a client story?",
             "Only with permission, only if it cannot identify them, and only if it is fair and not misleading. Many firms simply do not do this. That is a reasonable policy."),
            ("Is X a suitable advice channel?",
             "No. It is a publishing channel. Advice belongs in your regulated process."),
        ],
        ["x-post-ideas-for-accountants", "x-post-ideas-for-lawyers", "x-bio-examples", "how-to-write-x-posts-in-your-own-voice"],
    )

    # ---------- 14. Recruiters ----------
    register(
        "niche",
        "x-post-ideas-for-recruiters",
        "X post ideas for recruiters",
        "The role, the constraints and how you work — not a spam thread of “exciting opportunity”.",
        "X post ideas for recruiters (with example posts) · Netmend",
        "X post ideas for recruiters: how to post roles and process without spam, with original examples. No fake salaries, no invented companies.",
        "X growth guides",
        "X post ideas for <span>recruiters</span>",
        "“Exciting opportunity, DM me your CV” is why people mute recruiters. The posts that get serious candidates usually describe the work, the constraints, the location or pattern of work, and a salary range you can defend.",
        paras(
            "This is for in-house and agency recruiters. Only post roles you are actually mandated to fill. Do not invent companies, salary bands or visa sponsorship. Do not share a candidate’s details in public. Be honest if a role is on-site, if the budget is fixed, or if the process has four interviews.",
            "One well-written role post is more useful than ten identical “we are hiring” lines. Between roles, write about how you interview, what a good brief looks like, and what you will not do.",
        )
        + "<h2>How to post a role, and what else to post</h2>"
        + bullets([
            "<b>A role with constraints:</b> title, team, location/remote pattern, salary range, must-have skills, and how to apply (not only “DM me”).",
            "<b>A process post:</b> number of stages, whether there is a task, typical time from first chat to offer — if you actually know it.",
            "<b>A briefing post for hiring managers</b> (what you need from them), which also signals to candidates how you work.",
            "<b>A market observation you can source</b> — or skip the number if you cannot.",
            "<b>What you will not do:</b> bait-and-switch salaries, unpaid “trials” that are real work, ghosting after a final stage if you can help it.",
            "<b>A closed-role note.</b> When it is filled or pulled, say so, so people stop writing.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "We are hiring a product designer, permanent, for a 12-person team in Manchester, hybrid Tuesday and Wednesday in the office.\n\nSalary: £55,000–£65,000, plus the standard company pension. You will own the design of the billing settings, not a pitch deck. Apply through the link in the first reply; a portfolio of real product work is enough. No free trial task that looks like production work."),
            ("Question + list",
             "If you want me to recruit a role, I need these four things in writing before I go to market:\n\n1. A salary range you will actually offer.\n2. Must-haves vs nice-to-haves, in skills, not in years.\n3. The interview process, including any task, and who is on each stage.\n4. Whether visa sponsorship is possible.\n\nWithout those, I will not post the job."),
            ("Short twist",
             "“Competitive salary” is not information.\n\nA range is information. If the range is tight, say so. Candidates will find out at offer; I would rather they decide earlier."),
            ("Process",
             "For this role the process is: a 30-minute call with me, a 60-minute conversation with the hiring manager, a paid design exercise (half a day, £250), then a final conversation with two peers.\n\nWe aim to do all of that in three weeks. If we slip, I will tell you."),
            ("Closed role",
             "The product designer role I posted on 28 October is now at offer stage, so I am closing public applications.\n\nThank you if you wrote in. If you interviewed and you have not heard, you will hear this week, including if the answer is no."),
            ("What I will not do",
             "I will not send your CV to a client without your say-so, and I will not take a brief that uses “rockstar” as a substitute for a salary band.\n\nIf that is the brief, I will send it back."),
            ("Very short hook",
             "If the job post has no location, no pattern of work and no salary range, it is not finished.\n\nI will not share it until those lines are on it."),
            ("Candidate care",
             "If you reached a final stage with us and we hired someone else, I will tell you, and I will tell you once, clearly, not with a vague “we went in another direction” and silence.\n\nI do not always get this right when the week explodes. It is still the standard."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "No scraped CV comments, no “I have a role that would be perfect for you” in a public reply to a stranger’s personal post, no fake urgency. Use the free writer to draft the role post, then check the salary, the location and the link before it goes out.",
        ),
        [
            ("Should every role be a thread?",
             "Only if you have more than a post’s worth of real information (process, team, stack). Otherwise one clear post plus a link is enough."),
            ("Can I post roles in several time zones as “remote”?",
             "Say the time zone or the countries you will actually hire in. “Remote” that means “UK hours only” should say so."),
            ("Will this fill a pipeline by itself?",
             "It can help, especially for visible roles. Most mandates still need direct search. Do not promise a founder otherwise."),
        ],
        ["x-post-ideas-for-saas-founders", "how-to-reply-on-x-to-grow", "x-bio-examples", "x-hook-formulas"],
    )

    # ---------- 15. Marketing agencies ----------
    register(
        "niche",
        "x-post-ideas-for-marketing-agencies",
        "X post ideas for marketing agencies",
        "The work, the constraint and the measurement — not a dump of award logos.",
        "X post ideas for marketing agencies (with example posts) · Netmend",
        "X post ideas for marketing agencies: case-style posts without fake metrics, process notes and original examples.",
        "X growth guides",
        "X post ideas for <span>marketing agencies</span>",
        "A wall of award badges and “we make brands unforgettable” does not help a buyer brief you. Agencies that write well on X usually talk about a constraint, a piece of work, how they measure, or what they will not take on.",
        paras(
            "This is for small and mid-size agencies (content, performance, brand, SEO, social). If you quote a result, use a real figure the client has cleared, with the time period and what else was going on. “3x growth” with no baseline is an advert, not a case. Do not share a client’s unreleased work.",
            "Between case posts, write about how you start, how you report, and the brief you wish you received more often.",
        )
        + "<h2>Posts that a buyer can use</h2>"
        + bullets([
            "<b>A piece of work with the constraint:</b> budget, time, channel, what was off-limits.",
            "<b>A measurement note:</b> what you actually report, and what you will not claim credit for.",
            "<b>A briefing checklist</b> you wish clients arrived with.",
            "<b>A process post:</b> discovery, first 30 days, monthly reporting, who is in the Slack.",
            "<b>A disagreement with a fad</b>, with your method instead of a dunk.",
            "<b>What you will not sell</b> (guaranteed rankings, fake reviews, a 10-post “viral” package).",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "For a 12-week search project we shipped last spring, the constraint was: no new domain, no paid ads, and the product pages could not be redesigned.\n\nWe rewrote 14 titles and meta descriptions, fixed the internal links on the help centre, and cut two overlapping landing pages. Organic sign-ups from those 14 pages went from 110 a month to 164 a month, in the 90 days after launch, with no other campaign on them. The client has agreed to those numbers being public. That is the whole case."),
            ("Question + list",
             "If you are briefing an agency, these five lines save a week:\n\n1. The business outcome (not “more awareness”).\n2. What “good” looks like in a number you already track.\n3. What is off-limits (tone, channels, claims).\n4. Who signs off, and how often they are available.\n5. The budget, as a range if necessary.\n\nWe will still have questions. We will have fewer."),
            ("Short twist",
             "We will not sell you a “viral campaign”.\n\nWe can write work that is easy to share, and we can tell you what happened after it ran. Nobody honest can sell virality as a deliverable. If an agency promises it, ask how they will refund you when it does not happen."),
            ("Measurement",
             "We do not take credit for a revenue spike if the client also ran a TV ad or a price cut in the same week.\n\nOur monthly report says what we did, what moved, and what else was in the market. It is less exciting than a vanity dashboard. It is harder to argue with six months later."),
            ("Process",
             "The first 30 days with us are: a written kickoff, access to the accounts we need, a measurement plan you approve, and one small ship (a page, an email, a test), not a 90-page strategy with no output.\n\nIf we cannot ship something small in 30 days, we will say why, early."),
            ("What we will not take",
             "We do not run campaigns that need fake reviews, hidden affiliate posts, or claims the product cannot stand behind.\n\nThat is not a moral speech. It is a risk we are not willing to put our name on."),
            ("Very short hook",
             "If the only KPI is “engagement”, the brief is not finished.\n\nTell us which business number this work is for, even if the number is a leading one."),
            ("Work in public, carefully",
             "We rewrote the onboarding email sequence for a B2B tool. The constraint was: no new design, three emails, and no invented testimonials.\n\nThe change was structural: one job per email, the price in email two, a human name on the last line. We will not post a lift figure for this one; the client asked us not to. The method is still fair to share."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "No award bragging without the work. No “we grew a brand 10x” with no date. No subtweet wars with other agencies. Draft with the free writer if you want; have the account lead check every number and every client name.",
        ),
        [
            ("Should we post every campaign?",
             "Only with clearance, and only if you can describe the constraint and the result honestly. A maybe-metric is worse than no case."),
            ("Is thought leadership dead?",
             "Vague thought leadership is. A specific method, a disagreement, or a briefing post is still useful."),
            ("Can we ask for a follow?",
             "You can. It is a weak close after a good post. Put the site or the mailing list in the bio and let the work do the next step."),
        ],
        ["x-post-ideas-for-consultants", "how-to-write-a-viral-x-thread", "x-hook-formulas", "x-post-ideas-for-saas-founders"],
    )

    # ---------- 16. Indie hackers ----------
    register(
        "niche",
        "x-post-ideas-for-indie-hackers",
        "X post ideas for indie hackers",
        "Ships, decisions and real numbers — not a fake MRR screenshot every Monday.",
        "X post ideas for indie hackers (with example posts) · Netmend",
        "X post ideas for indie hackers and solo builders: ship notes, decisions and honest numbers, with original examples. No fake MRR.",
        "X growth guides",
        "X post ideas for <span>indie hackers</span>",
        "Build-in-public went stale when every post became a template: day count, a revenue graph, a lesson that could apply to anyone. The posts that still help are dated ships, decisions, and numbers you would also stand behind if a customer asked.",
        paras(
            "This is for solo and tiny-team builders. You do not have to post revenue. If you do, it should be real, and you should be ready for it to be screenshotted for years. Do not invent a waitlist count. Do not imply a dying product is “exploding”.",
            "Write the unit of work: what shipped, what broke, what you will do next week, and one thing you are not building.",
        )
        + "<h2>What to post when you are the whole company</h2>"
        + bullets([
            "<b>A ship note</b> with a date and a limitation.",
            "<b>A decision</b> (pricing, a killed feature, a channel you stopped) and the reason.",
            "<b>A number with a denominator:</b> 12 paying customers out of 80 trials, not “growth is up”.",
            "<b>A support or onboarding insight</b> from real users, without exposing them.",
            "<b>A stack or cost note</b> if it is useful (what you pay for hosting this month) — optional, not a flex.",
            "<b>A ask that is specific:</b> “I need two people who invoice in euros to try this export”, not “feedback welcome”.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "Shipped this afternoon: CSV export of invoices, UTF-8, with a decimal comma if the workspace is set to Europe.\n\nIt does not yet include credit notes. That is next week. If you invoice in euros and you have 20 minutes, I would like you to break it. The link is in my bio."),
            ("Question + list",
             "I killed the public roadmap this week, for three reasons:\n\n1. People treated it as a promise.\n2. Competitors copied the titles, which I do not actually mind, but customers were confused when dates slipped.\n3. I was writing the roadmap instead of the work.\n\nRequests still come in by email. I will ship, then say what shipped."),
            ("Short twist",
             "I have 19 paying customers, not 190.\n\nI would rather write that sentence than post a graph I have to crop. 19 is enough to talk to, and not enough to pretend I have product-market fit as a slogan."),
            ("Onboarding",
             "Three of the last five trial users stalled on the same screen: they could not tell whether to add a client first or an invoice first.\n\nI put “add a client” in the empty state and hid the other buttons until one client exists. I will report in a fortnight whether the drop-off moved, not tonight."),
            ("Costs",
             "This product’s bill this month: $17 hosting, $0 for email (still inside the free tier), and my time.\n\nWhen email goes over the free tier I will post the new number. I will not invent a “stack” for a screenshot."),
            ("Specific ask",
             "I need two bookkeepers who already use bank CSV files to try a mapping screen.\n\nIt will take 15 minutes, on a dummy file if you prefer. I will watch, I will not sell you anything on the call, and I will pay a $40 thank-you. Reply or email the address in my bio."),
            ("Very short hook",
             "If I cannot explain the product in one sentence that names the user and the file they already have, I am not ready to run ads.\n\nI am still on that sentence. I am not running ads."),
            ("Decision",
             "I am not adding a mobile app this year.\n\nThe work is a desktop browser job (tables, CSV, invoices). An app would be a second product I cannot support. If that means I lose people who only want to work on a phone, I will lose them."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "No fake MRR, no “day 3, $0 to $4,200”, no dunking on a platform you still need, no “leaving this up for 10 minutes” scarcity. Use the free X Post Writer to get 10 tones of a ship note, then check every figure.",
        ),
        [
            ("Do I have to post revenue?",
             "No. Plenty of serious builders never do. If you do, be consistent and honest, including on the quiet months."),
            ("Is a daily build log required?",
             "No. A weekly ship note is enough for most people. Daily posts that say “still coding” do not help anyone."),
            ("Can I post user quotes?",
             "With permission, and without editing them into a testimonial they did not write."),
        ],
        ["x-post-ideas-for-saas-founders", "x-post-ideas-for-freelancers", "how-to-write-an-x-thread", "x-hook-formulas"],
    )

    # ---------- 17. Course creators ----------
    register(
        "niche",
        "x-post-ideas-for-course-creators",
        "X post ideas for course creators",
        "A useful lesson, the syllabus and who it is not for — not a fake countdown to a cart.",
        "X post ideas for course creators (with example posts) · Netmend",
        "X post ideas for course creators: lesson posts, syllabus notes and honest scope, with original examples. No fake scarcity or invented student results.",
        "X growth guides",
        "X post ideas for <span>course creators</span>",
        "A countdown timer and a testimonial you wrote yourself will eventually be noticed. Course creators who get useful attention on X usually teach a small piece in public, describe who the course is not for, and talk about the syllabus as a set of outcomes, not a vibe.",
        paras(
            "This is for people who sell a class, a cohort or a self-paced course. Do not invent student results or enrolments. Do not fake a closing cart. If you quote a student, use their words, with permission. Be clear about price, duration, refunds and how much of your time is included.",
            "The public lesson should be complete in itself — a method a reader can use today — not a teaser that stops just before the useful step.",
        )
        + "<h2>Posts that teach, and posts that sell without tricks</h2>"
        + bullets([
            "<b>A complete micro-lesson</b> from the course, with the step people usually skip.",
            "<b>The syllabus as outcomes</b>, not module titles. What someone will be able to do.",
            "<b>Who it is not for</b>, in specific terms.",
            "<b>How the course is run:</b> start dates, live vs recorded, how you give feedback, what happens after week four.",
            "<b>A change you made</b> after the last cohort (a rewritten lesson, a dropped module).",
            "<b>Price and refunds</b> as facts, when you are selling, not as a dark-pattern countdown.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "A micro-lesson from the research module: before you interview anyone, write the decision the research is meant to change, in one sentence.\n\nIf you cannot write the decision, you are collecting quotes for a slide, not doing research. This is the whole lesson; there is no secret step behind a cart."),
            ("Question + list",
             "This course is not for you if:\n\n1. You need a certificate for an employer (I do not issue one).\n2. You cannot spend four hours a week for six weeks.\n3. You want me to do the interviews for you.\n4. You are looking for a job in my company.\n\nIf none of those apply, the syllabus is on the site."),
            ("Short twist",
             "I cut a module from the next cohort.\n\nIt was popular, and it did not change what people shipped. The time now goes to a second live critique. I would rather be useful than complete."),
            ("Syllabus as outcomes",
             "By the end of week 6, you should be able to: write a one-page research plan, run five interviews, and present a decision memo with a recommendation and the evidence.\n\nYou will not leave with a personal brand, a Notion aesthetic, or a promise of a job. The memo is the product."),
            ("How it runs",
             "The next cohort starts on 12 January, runs for six weeks, and is capped at 20 people so I can comment on the homework.\n\nThere is one live session a week, recorded. The price is $390, or two payments of $200. A full refund is available in the first 7 days, before week 2’s session. The page has the official wording."),
            ("Student quote, careful",
             "After the last cohort, a student wrote (and agreed to be quoted): “I finally sent the memo. The interviews were messy, and I still sent it.”\n\nThat is the kind of result I am comfortable repeating. I will not invent a promotion or a salary for a testimonial."),
            ("Very short hook",
             "If the sales page talks more about lifestyle than about the work you will do, I would not buy the course.\n\nI try to write the opposite kind of page. Call me on it if I slip."),
            ("Lesson people skip",
             "In the writing week, the step people skip is reading the memo out loud.\n\nIf you cannot say a sentence in one breath, the sentence is too long for a busy reader. This takes four minutes and saves a rewrite."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "No fake “doors close at midnight” if they do not, no “I made my student $100k”, no tag-bombing. Use the free writer for lesson posts and syllabus copy, then check dates, prices and refund wording against the sales page.",
        ),
        [
            ("Should I give the best material away?",
             "A complete small lesson is marketing and a filter. People who want the feedback, the structure and the deadlines still buy. Teasers that withhold the useful step annoy the people you want."),
            ("How often should I sell?",
             "When a cohort is actually open, say so clearly. Between cohorts, teach. A permanent fake launch is easy to see."),
            ("Can I post student work?",
             "With permission, and without exposing their employer or their data."),
        ],
        ["x-post-ideas-for-coaches", "x-post-ideas-for-consultants", "x-post-ideas-for-authors", "how-to-write-an-x-thread"],
    )

    # ---------- 18. Interior designers ----------
    register(
        "niche",
        "x-post-ideas-for-interior-designers",
        "X post ideas for interior designers",
        "The brief, the constraint and the why of a choice — not a mood board with no caption.",
        "X post ideas for interior designers (with example posts) · Netmend",
        "X post ideas for interior designers: how to caption a project, explain a choice and describe a process, with original examples.",
        "X growth guides",
        "X post ideas for <span>interior designers</span>",
        "A handsome room with no caption is a mood board. Designers who get useful conversations on X usually write the brief: the constraint, the budget band if they can share it, why that floor, why that light, what the client refused, what you would still change.",
        paras(
            "Get permission before you post a private home, a child’s room, or a project a client has not signed off for publicity. Do not invent a budget or a brand collaboration. Do not pass off a supplier’s render as a finished room. Credit photographers, makers and architects when their work is in the frame.",
            "The caption should answer “why is it like this?” rather than “look at this”.",
        )
        + "<h2>What to write under a picture, and without one</h2>"
        + bullets([
            "<b>The brief in one paragraph:</b> who uses the room, the problem, the non-negotiables.",
            "<b>A single material or product decision</b> and the reason (light, acoustics, wear, lead time).",
            "<b>A process post:</b> survey, concept, samples, ordering, site, snagging — and who is responsible at each step.",
            "<b>A budget or fee note</b> if you are comfortable: how you charge, what a small project starts at.",
            "<b>A supplier or maker credit</b> that is specific.",
            "<b>A thing you would still change</b>, which is more credible than a perfect reveal.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "This living room had to work for a wheelchair user and two dogs, with no step at the terrace door.\n\nWe specified a durable, tight-weave wool, a 90cm clear route through the furniture, and a door threshold designed with the joiner for a level change of less than 5mm. Photographer: Maya Cole, used with the client’s permission. (Fictional credit, for the example.)"),
            ("Question + list",
             "Before I start a concept, I need these four things:\n\n1. Who uses the room, at what times of day.\n2. What must stay (a piano, a inherited table, a colour someone loves).\n3. The budget for furniture and for works, even as a range.\n4. The date someone actually needs to move back in.\n\nA Pinterest board is useful. It is not a brief."),
            ("Short twist",
             "The most expensive thing in this kitchen is not the worktop.\n\nIt is the six weeks of joinery, because the room was not square. I would rather tell you that at survey than surprise you at install."),
            ("Decision",
             "We used a matt emulsion, not a washable “kitchen paint”, on this dining room ceiling, because the sheen was showing every ripple in a 19th-century slab.\n\nThe walls are a washable mid-sheen, because of the chairs. Two finishes, one colour. Not a slogan, a response to the light."),
            ("Process",
             "A typical residential project with me runs: paid survey and a written proposal, a concept with samples, a specification and order list, then site visits during works and a snagging list at the end.\n\nI do not order until the specification is signed. Lead times sit in that document, not in a hopeful chat."),
            ("Fee",
             "For a single-room refresh (no structural works), I start at £2,400 for the design package: survey, concept, specification and a shopping list.\n\nPurchasing, site visits and a full renovation are quoted separately. I would rather put this here than hide it until a call."),
            ("Very short hook",
             "If the only brief is “make it look like the photo”, I will send it back.\n\nTell me how the room is used, and what the photo is getting right — the light, the storage, or just the colour."),
            ("Credit and limit",
             "The table is by a local maker, Sam Reza, in oak, made to the width of the alcove. (Fictional maker, for the example.)\n\nI will not call it a “bespoke lifestyle moment”. It is a table that fits. The client has agreed to this post; the maker is credited because the work is theirs."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "No uncredited photographs, no “before” that humiliates a client, no fake brand trips. Draft captions with the free writer if you want, then check permissions, names and whether the room is finished enough to show.",
        ),
        [
            ("Can I post a project still on site?",
             "Only with the client’s okay, and only if you are honest that it is in progress. A dusty room presented as a reveal helps no one."),
            ("Should I post every sample board?",
             "Occasionally, if you can explain a choice. A weekly uncaptioned board is just a catalogue."),
            ("Do I need a photographer?",
             "For a hero project, usually yes. Credit them. A phone photo is fine for a process or a material post if it is honest."),
        ],
        ["x-post-ideas-for-photographers", "x-post-ideas-for-real-estate-agents", "x-hook-formulas", "how-to-write-x-posts-in-your-own-voice"],
    )

    # ---------- 19. Therapists ----------
    register(
        "niche",
        "x-post-ideas-for-therapists",
        "X post ideas for therapists",
        "Psychoeducation and how you work — never a diagnosis, a crisis service, or a client story that can be recognised.",
        "X post ideas for therapists (with example posts) · Netmend",
        "X post ideas for therapists and counsellors: psychoeducation and process posts, with original examples. Not therapy, no client stories, no crisis advice on X.",
        "X growth guides",
        "X post ideas for <span>therapists</span>",
        "Therapy does not happen on X. What can happen, carefully, is psychoeducation: a plain explanation of a term, a description of how you work, or a signpost to proper help. Anything that looks like a diagnosis, a crisis intervention, or a recognisable client story does not belong here.",
        paras(
            "This page is for therapists, counsellors and similar practitioners writing in public. It is not therapy, not a clinical guideline, and not a way to take someone on mid-crisis. Follow your professional body’s advertising and confidentiality rules. Do not give the impression that a post can replace care. If someone is in immediate danger, they need emergency services or a local crisis route, not a thread.",
            "Write generally, invite people to use your proper booking or enquiry channel, and keep the comments from becoming a group session you cannot supervise.",
        )
        + "<h2>What is usually appropriate</h2>"
        + bullets([
            "<b>A plain-language explanation of a term</b> you actually use (a type of session, a boundary, a commonly misunderstood word), with a note that meanings vary.",
            "<b>How you work:</b> length of sessions, in-person or online, who you usually see, how to enquire, fees if you publish them.",
            "<b>A boundary post:</b> you do not provide therapy in direct messages or comments.",
            "<b>A signpost</b> to official or established crisis and directory resources in your country, not to a random thread.",
            "<b>A myth correction</b> that does not mock people who believed it.",
            "<b>What you do not treat</b>, or when you refer on, if you can say that clearly.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Concrete-fact hook",
             "I do not provide therapy in direct messages or in the comments of a post.\n\nIf you want to enquire about a session, use the contact form on my site, which goes into a confidential inbox. If you are in immediate danger, contact emergency services or a local crisis line in your country. A social media account is not a clinic."),
            ("Question + list",
             "People often ask what “a 50-minute session” actually contains. In my practice, it usually looks like this:\n\n1. A short check-in about the week.\n2. The work you want to bring that day.\n3. A few minutes at the end to notice what is staying with you, and practicalities (the next date, fees).\n\nOther practitioners work differently. This is a description of my room, not a rule for therapy."),
            ("Short twist",
             "Feeling better after one conversation is possible, and it is not the same thing as finished work.\n\nI will not sell a “breakthrough in a thread”. If we work together, we will talk about pace in the room, not on here."),
            ("How I work",
             "I am a counsellor working with adults, online, in English, usually weekly, at £70 for 50 minutes. In a live bio I would also name the professional register I actually sit on — I am not inventing one here.\n\nI am not taking on emergency or crisis work through this account. The enquiry form is on the site; I will reply there, not in a public thread."),
            ("Term, carefully",
             "“Burnout” is a word people use for many different states: exhaustion, boredom, depression, a bad job, or something clinical that needs a different kind of help.\n\nI will not tell you which one you have from a post. If you are struggling, a first step is to speak to a qualified practitioner or your doctor, not to diagnose yourself from a thread."),
            ("Referral / limit",
             "If what you need is specialist treatment I do not offer, I will say so and, where I can, point you to a directory or a service that does.\n\nThat is part of the job. It is not a rejection of you as a person."),
            ("Very short hook",
             "A comment section is not a therapy group.\n\nI will not go into your history there, and I will ask others not to either. Use a proper, confidential channel."),
            ("Myth correction",
             "Therapy is not “advice from a wise friend”, at least not the way I practise it.\n\nIt is a structured, confidential relationship with a frame (time, fee, consent). If you want advice only, a friend or a coach may be a better fit, and it is fair to say that."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "No client vignettes that could be recognised, no diagnosing a public figure, no “my client today”, no crisis therapy in a reply, no miracle claims. Have a supervisor or a trusted colleague read a draft if you are unsure. The free writer can help with plain language; it cannot hold clinical responsibility.",
        ),
        [
            ("Can I share an anonymised story?",
             "Many professional bodies warn against this, because anonymity fails more easily than you think. A clearly labelled fictional example, or no story at all, is safer."),
            ("Should I turn comments off?",
             "Sometimes, especially under a crisis-related post. You cannot moderate a comment section as if it were a clinic."),
            ("Is it ethical to have a fee post?",
             "Publishing fees is often fair and reduces wasted enquiries. Keep it factual. Do not pressure."),
        ],
        ["x-post-ideas-for-coaches", "x-post-ideas-for-dentists", "x-bio-examples", "how-to-write-x-posts-in-your-own-voice"],
    )

    # ---------- 20. Authors ----------
    register(
        "niche",
        "x-post-ideas-for-authors",
        "X post ideas for authors",
        "The work, the process and a line that stands alone — not a daily “buy my book” lunge.",
        "X post ideas for authors (with example posts) · Netmend",
        "X post ideas for authors and writers: process posts, lines that stand alone, and honest publication notes, with original examples.",
        "X growth guides",
        "X post ideas for <span>authors</span>",
        "A feed that only says “my book is out” is a catalogue. Authors who get something useful out of X usually post a line that stands on its own, a process note, a research detail, or a clear, dated piece of publication news — and they do not apologise for writing, or for asking once, clearly, where the book can be found.",
        paras(
            "This is for novelists, non-fiction writers, poets and essayists. Do not invent blurbs, bestseller ranks or reviews. Do not paste someone else’s text as if it were yours. If you quote a review, keep it accurate and within fair use or the reviewer’s permission. Be honest about whether a book is self-published, traditionally published, or not yet out.",
            "A good writing post often does one of two jobs: it is a complete thought a stranger can enjoy, or it is a window on the work (research, structure, a constraint) that does not require the reader to have bought the book.",
        )
        + "<h2>What to post besides the cover</h2>"
        + bullets([
            "<b>A self-contained line or paragraph</b> you are willing to stand behind without the rest of the chapter.",
            "<b>A process post:</b> hours, drafts, how you research, how you cut.",
            "<b>A research or reporting detail</b> (for non-fiction) with a source when a fact is cited.",
            "<b>A publication fact:</b> publication date, where it is sold, whether there is an audiobook, a launch event with a place and time.",
            "<b>A reading or craft note</b> that is yours, not a dunk on a successful stranger.",
            "<b>A once-in-a-while, clear ask</b> (pre-order, a review if the reader already finished it), not a daily lunge.",
        ])
        + "<h2>Example posts you can adapt</h2>"
        + posts([
            ("Very short hook",
             "The first draft is where I find out what the book is not.\n\nThe second is where I stop pretending the discarded plot was a secret strength."),
            ("Concrete-fact hook",
             "The book comes out on 3 March, in paperback and ebook, and the audiobook follows in April, read by Jordan Hale, if that date holds.\n\nThe pre-order link is in my bio. I will post it again closer to the date, not every morning until then."),
            ("Question + list",
             "When I get stuck on a chapter, I do these three things before I invent a new plot:\n\n1. Write the scene in six sentences, as if to a friend.\n2. Cut any sentence that explains a feeling the action already shows.\n3. Read it out loud once, standing up.\n\nIf it still dies, the problem is usually earlier, in the previous chapter, not in a missing twist."),
            ("Research",
             "A detail in chapter four comes from the official report of the 1953 flood, not from a documentary I half-remembered.\n\nI put the report in the acknowledgements. If I got something wrong, I want to hear it, in writing, and I will correct it if I can."),
            ("Short twist",
             "I do not write every day.\n\nI write most weekday mornings for 90 minutes, and I take the school holidays off more often than a productivity thread would like. The book still got finished. Your rhythm can be dull and still be real."),
            ("Craft",
             "If a paragraph exists only to show that I did the research, I cut it.\n\nThe reader should feel that I know the place. They should not have to watch me unpack the archive onto the page."),
            ("Ask, once",
             "If you have already finished the book and you were going to leave a review, it does help — on the shop you bought it from, in your own words.\n\nIf you have not read it, please do not post a review. That is the whole ask."),
            ("Process",
             "This week I cut 3,200 words from the middle of the book, including a character I liked.\n\nShe was doing work the plot no longer needed. I have saved her in a notes file, which is where most of my darlings now live. The chapter is shorter, and the next one starts sooner."),
        ])
        + "<h2>What to skip</h2>"
        + paras(
            "No fake “#1 in a tiny category” flex presented as a bestseller list, no bought reviews, no fights with reviewers who simply did not like the book. Use the free X Post Writer for process posts and announcement drafts, then check dates, links and names.",
        ),
        [
            ("How often may I mention the book?",
             "Often enough that a new follower can find it, rarely enough that a regular is not being sold to in every post. A pinned post and a bio link do a lot of that work."),
            ("Should I post drafts?",
             "Only if you are willing to see them circulate. A finished line is usually safer than a raw paragraph you may later dislike."),
            ("Is X useful for fiction at all?",
             "Sometimes, for process, community and announcements. It is not a replacement for the work, the editor, or the places your readers already are."),
        ],
        ["x-post-ideas-for-course-creators", "how-to-write-x-posts-in-your-own-voice", "x-hook-formulas", "how-to-write-an-x-thread"],
    )

    # ---------- 21. Viral thread ----------
    register(
        "problem",
        "how-to-write-a-viral-x-thread",
        "How to write a viral X thread",
        "A structure that is easy to read. Not a promise that it will travel.",
        "How to write a viral X thread (structure and examples) · Netmend",
        "How to write an X thread that is easy to read and easy to share, with original examples. Honest about what “viral” means: nobody can guarantee it, including us.",
        "X growth guides",
        "How to write a <span>viral X thread</span>",
        "Most threads do not go viral, including carefully written ones. What you can control is whether a thread is easy to open, easy to finish, and easy to share: a first post that stands alone, one idea per post, and a finish that does not collapse into a pitch. That is the craft. Distribution is then up to the audience and the platform.",
        paras(
            "“Viral” in search terms usually means “I want this to travel further than my current followers.” There is no honest vendor, including Netmend, who can promise that. There is a way of writing that removes the usual reasons a thread dies: a vague hook, a ramble, a bait-and-switch, or a first post that makes no sense without the rest.",
            "This page is a structure, with original example threads you can adapt. Use only facts you can stand behind. Do not invent numbers to make a hook louder.",
        )
        + "<h2>A structure that is easy to share</h2>"
        + facts([
            ("Post 1", "A complete thought. A concrete fact, a sharp claim you can defend, or a question that names a real situation. The reader should know why they would open the rest."),
            ("Posts 2–N", "One idea per post. A step, an example, a counter-argument, a limit. Short enough to read on a phone. Number them if the sequence matters."),
            ("The finish", "A takeaway, a limit of the argument, or a next step the reader can do without buying something. If you have a link, it can sit here, once, clearly."),
        ])
        + paras(
            "The first post has to work in the feed on its own. If it only says “A thread 🧵” or “Here is everything I know about X”, people who do not already trust you will keep scrolling. Put the most specific sentence first.",
            "Do not stretch a 4-post idea into 18 posts. Do not hide the point behind a long throat-clearing. Do not end on “follow for part 2” if part 2 is the actual answer.",
        )
        + "<h2>Example threads (fictional, complete)</h2>"
        + paras("Each example is a short thread, written for this page. They are not real accounts, and they are not a record of impressions.")
        + posts([
            ("Thread · process, 4 posts",
             "1/ We stopped doing kickoff calls with no agenda. The work got better, not worse.\n\n2/ Before the call, both sides write: the job, the deadline, the budget range, and what “done” looks like in a file or a page.\n\n3/ If they cannot write those four lines, we do not book the call. That filter has saved more time than any new tool.\n\n4/ If you already have the four lines, a 30-minute call is then useful. If you do not, email is enough. That is the whole method."),
            ("Thread · a concrete fact, 3 posts",
             "1/ The support ticket we answered 40 times in October was not a bug. People were pasting an API token into the “workspace ID” field.\n\n2/ We relabelled the field, added an example value, and rejected tokens with a specific error message. The docs, on their own, had not been enough.\n\n3/ If you have a ticket that repeats, change the interface, not only the help article. That is the lesson; there is no part 4."),
            ("Thread · a claim with limits, 4 posts",
             "1/ A thread should be shorter than your enthusiasm.\n\n2/ If the point is a three-step method, write three posts and a close, not a memoir of how you discovered the method.\n\n3/ If a post is only a joke, a throat-clear, or “as I said above”, cut it. The reader already had to click once.\n\n4/ Count the posts before you publish. If you can cut two and the argument still stands, cut two."),
            ("Thread · how-to, 5 posts",
             "1/ If you want a useful industry thread, write it from a job you actually did last month, not from “the future of work”.\n\n2/ Start with the constraint: the time, the budget, the tool you were stuck with.\n\n3/ Tell the steps in the order you did them, including the one that failed.\n\n4/ Say what you would repeat, and what was luck or a one-off.\n\n5/ Stop. A link to the longer write-up can sit here if you have one. The thread should still make sense if nobody clicks."),
            ("Thread · short twist, 3 posts",
             "1/ “I will write a viral thread” is a bad first line, because it is about you, not about the reader.\n\n2/ A better first line is a fact, a mistake, or a method the reader can use without knowing you.\n\n3/ Whether it travels is then out of your hands. The writing still has to be good enough that you would not mind if it stayed with 40 people."),
            ("First post only · weak vs stronger",
             "Weak: “A thread on how we do onboarding 🧵”\n\nStronger: “We hid every button on the home screen until the user adds one client. Trial drop-off at that step is the thing we are trying to move.”\n\nThe second one is already a post. The rest of a thread, if you need it, can explain how and why."),
            ("What not to do",
             "Do not open with “I cannot believe this is not talked about more.”\nDo not promise “the only guide you will ever need.”\nDo not invent a statistic for the hook.\nDo not wait until post 9 to say the point.\nDo not end on “like and follow for part 2” if you already have the ending."),
            ("Finish lines that are not a hard sell",
             "Useful finishes:\n“That is the whole method. I use it on website rebuilds.”\n“If your facts differ, this may not apply.”\n“I wrote a longer version on our site. The steps above still stand on their own if nobody clicks.”\n\nLess useful: “Comment ‘GUIDE’ and I will DM you the PDF.” That is a trap, and people treat it like one."),
        ])
        + "<h2>After you draft</h2>"
        + paras(
            "Read the first post on its own. If it is vague, rewrite it before you touch the rest. Read the thread out loud. Cut any post that only exists to keep a streak going. Check every figure. Then, if you want alternatives, paste the outline and a few of your old posts into the free X Post Writer and ask for short threads. It will draft; it will not know whether a number is true, and it cannot make a thread travel.",
        ),
        [
            ("Is there a trick to going viral on X?",
             "No reliable one. Clear writing, a specific first line, and a topic people already care about help a post get a fair chance. Tricks (engagement bait, fake urgency, tagging strangers) usually cost more trust than they buy."),
            ("How long should a thread be?",
             "As short as the idea allows. Many good ones are three to six posts. If you need twelve, you probably have two threads, or a blog post with a short thread as the summary."),
            ("Should every post in the thread work alone?",
             "The first one must. The others can assume the reader opened the thread, but each should still be a complete sentence or two, not a dangling “And then…”."),
        ],
        ["how-to-write-an-x-thread", "x-hook-formulas", "how-to-get-more-replies-on-x", "how-to-write-x-posts-in-your-own-voice"],
    )

    # ---------- 22. Hook formulas ----------
    register(
        "problem",
        "x-hook-formulas",
        "X hook formulas",
        "Seven structures for a first line, with examples — not canned topics to copy.",
        "X hook formulas (with example first lines) · Netmend",
        "X hook formulas you can reuse: question plus list, concrete fact, short twist and more, with original examples. Structures, not canned topics.",
        "X growth guides",
        "X hook <span>formulas</span>",
        "A hook is the first line that has to work in a busy feed. The useful ones are structures, not topics: a way of starting, which you then fill with a fact you can stand behind. A copied “unpopular opinion” about a subject you do not work in is not a hook. It is a costume.",
        paras(
            "These are the same families of structure we use when we write for X, and the ones the free X Post Writer rotates through. They are not a guarantee of replies or reach. They are a way of stopping the first line from being a throat-clear or a slogan.",
            "Write the first line last if you need to. Many drafts get better when you delete the opening and start at the first concrete sentence.",
        )
        + "<h2>Seven structures, with examples</h2>"
        + posts([
            ("1 · Question + numbered list",
             "Structure: a real question, then 3–5 concrete answers.\n\nExample: “If you are hiring a freelancer this month, put these four lines in the brief before you ask for a price:\n1. What already exists.\n2. What ‘done’ looks like, in files.\n3. The drop-dead date, and why.\n4. Who signs off — one name.”"),
            ("2 · Concrete-fact hook",
             "Structure: open with a number, a rule, or a dated event that is in your material, then say why it matters.\n\nExample: “We turned off CSV export of raw webhook logs today. It was used by 11 accounts, and two of them were exporting 4 million rows at a time.”"),
            ("3 · Short twist",
             "Structure: one line that goes against the expected slogan, then the correction, then a rule you can use.\n\nExample: “A coffee subscription should be boring. Same bag, same weight, roasted the week it ships.”"),
            ("4 · Lessons from work",
             "Structure: only if you did the work. “I did N. Here is what I would repeat.”\n\nExample: “Three projects that went wrong last year had the same first week: a kickoff call, no written brief, and ‘we will know it when we see it’ on taste.”"),
            ("5 · Anatomy / parts of a thing",
             "Structure: the N parts of a job, named, not padded.\n\nExample: “A complete freelance brief is four parts: existing files, definition of done, a real date, and one person who can say yes.”"),
            ("6 · Very short hook",
             "Structure: the first line does almost all the work. A second line, if you need it, only specifies.\n\nExample: “If your goal has no weekly behaviour, it is a mood.”"),
            ("7 · Process, in order",
             "Structure: the steps as you actually do them, with the stop rule.\n\nExample: “For year-end we ask for the pack eight weeks before the filing date. If it arrives late, we will tell you, early, whether the date is still realistic.”"),
            ("A first line to avoid",
             "“I can not believe more people are not talking about this.”\n“A thread 🧵”\n“Unpopular opinion:” plus a popular opinion.\n“Here’s how I 10x’d…” with no baseline.\n“Just listed!” with no constraint.\n“Excited to announce…” with no fact.\n\nIf you delete the first line and the post gets clearer, delete it."),
        ])
        + "<h2>How to use a formula without sounding like a formula</h2>"
        + bullets([
            "<b>Fill it with your own material.</b> The structure is reusable. The facts are not. If you do not have a number, do not invent one; use a rule, a sequence, or a distinction instead.",
            "<b>Keep the first line specific.</b> Names, objects, dates, constraints. “People make this mistake with onboarding” is weaker than “People were pasting an API token into the workspace ID field.”",
            "<b>Do not stack formulas.</b> One hook, then the body. A question and a twist and a list of lessons is a mess.",
            "<b>Match the hook to the length.</b> A very short hook can be the whole post. A question + list needs the list in the same post, or immediately in a thread.",
        ])
        + paras(
            "If you want 10 drafts that rotate these structures in your tone, paste a few of your old posts and one idea into the free X Post Writer. Then cut any hook that invented a figure or a testimonial.",
        ),
        [
            ("Do hooks still matter if I have few followers?",
             "Yes. Especially then. People who do not know you only have the first line and the first screen."),
            ("Can I reuse the same structure every day?",
             "You can rotate a handful. Using the same one every time makes a feed feel automated, even when it is not."),
            ("What if I do not have a striking number?",
             "Use a process, a distinction, a short twist, or a very short claim you can defend. A fake number is worse than a quiet true sentence."),
        ],
        ["how-to-write-a-viral-x-thread", "how-to-write-x-posts-in-your-own-voice", "how-to-get-more-replies-on-x", "how-to-write-an-x-thread"],
    )

    # ---------- 23. Best time to post ----------
    register(
        "problem",
        "best-time-to-post-on-x",
        "Best time to post on X",
        "There is no universal hour. Here is how to find yours, honestly.",
        "Best time to post on X (how to find yours, honestly) · Netmend",
        "There is no universal best time to post on X. How to use your own analytics, pick a window when you can reply, and run a fair two-week test — without invented statistics.",
        "X growth guides",
        "Best time to post on <span>X</span>",
        "There is no single best hour to post on X that holds for every account. A time that works for a US news account will not be the right time for a neighbourhood restaurant in another time zone. What you can do is find a window when your audience is actually around, and when you can stay for the first replies.",
        paras(
            "We are not going to quote a “Tuesday at 9:00 gets 3× impressions” study. Those round-ups mix industries, years and methods, and they go stale. X itself has long pointed people at their own analytics rather than a global timetable. Treat any universal timetable you see in a blog as marketing, unless it is clearly a study of accounts like yours, with a date and a method.",
            "The practical job has two parts: when your readers are awake, and when you can have a conversation. A perfectly timed post that you abandon for four hours often does worse than a slightly “off” post you can reply under.",
        )
        + "<h2>How to find a window that is yours</h2>"
        + bullets([
            "<b>Start with X Analytics</b> (when your account has access to it) and any breakdown of when your followers are active. That is the least bad first clue, because it is about your audience, not a blended average of the internet.",
            "<b>Name the time zone of the people you actually want to talk to.</b> A local shop, a US-only SaaS product, and a global newsletter have three different answers.",
            "<b>Pick one or two windows you can staff.</b> For example: weekday mornings in your audience’s time zone, and an early evening window. You need to be free for 20–40 minutes after you post, to reply.",
            "<b>Run a fair test for two weeks.</b> Same type of post (do not compare a throwaway joke at 07:00 with a careful essay at 18:00), two windows, a simple note of impressions, replies, and whether the replies were useful. Two weeks is a sketch, not a law, but it is better than copying a stranger’s timetable.",
            "<b>Prefer consistency over a magic hour.</b> A time you can keep is more useful than a theoretically perfect slot you miss four days a week.",
            "<b>Events break the timetable.</b> Breaking news, a product outage, a lunch special that has just sold out: post when the fact is true, then update.",
        ])
        + "<h2>What we will not claim</h2>"
        + paras(
            "We will not tell you that weekdays beat weekends for every trade, or that 9am Eastern is “the” hour, or that the platform always boosts a post in the first 30 minutes by a fixed factor. Those statements need evidence we do not have for your account. Your own logs are the evidence.",
            "If a scheduling tool offers “optimal times”, treat them as a suggestion from their dataset, not as a rule. Check what time zone they assume. Check whether they are looking at your account or at a global average.",
        )
        + "<h2>Example posts about timing (and posts worth posting when the fact is fresh)</h2>"
        + posts([
            ("When the fact is true",
             "The mackerel is gone for today.\n\nThe soup and the pork schnitzel are still on. Kitchen until 14:30.\n\n(This is a post you send when it sells out, not at a scheduled “optimal” hour.)"),
            ("A test, written down",
             "For the next two weeks I am posting the weekday process note at 08:30 and the same kind of note at 17:30, UK time, and I am staying for 30 minutes of replies each time.\n\nI will keep a small log: impressions, replies, whether any reply was useful. I will not change the writing mid-test just to chase a spike."),
            ("Audience time zone",
             "Most of the people who hire me are in UK or Ireland time, so I write in the morning here, and I do not worry about a 06:00 slot on the US west coast.\n\nIf that mix changes, I will test an afternoon window. I will not post at 3am for a theory."),
            ("Staffed window",
             "I post when I can answer for the next half hour.\n\nA carefully timed post that sits unread by me for a whole clinic day is a worse idea, for this account, than a slightly later post I can actually talk under."),
            ("Event-driven",
             "We are closing at 15:00 this Thursday, 19 November, for a staff meeting.\n\n(Hours-change posts belong on the day people might travel, not in a Friday “best time” batch you pre-wrote in October.)"),
            ("Very short hook",
             "There is no universal best time to post on X.\n\nThere is a time your audience is around, and a time you can reply. Start with those two."),
            ("What a weak timetable post sounds like",
             "Avoid this, unless you have a study: “Studies show the best time to post is Tuesday at 9am. RT if you agree.”\n\nIt is a vague claim, it is not about your readers, and the call to retweet is bait."),
            ("A practical rule",
             "If I can only post once on a weekday, I pick the window I can staff, in the time zone of the people I want to talk to, and I repeat it for a fortnight before I judge it.\n\nThat is the whole rule."),
        ])
        + "<h2>Writing still comes first</h2>"
        + paras(
            "A precise post in a slightly awkward hour will usually beat a vague post in a “perfect” hour. Use the free X Post Writer to get the draft ready so that, when your window opens, you are not starting from a blank box. Then stay for the replies. Timing without conversation is just scheduling.",
        ),
        [
            ("Does X tell me when to post?",
             "When analytics are available on your account, they are the first place to look. Menus change; treat the current analytics screen as the authority, not a screenshot from a blog."),
            ("Should I use a scheduler?",
             "You can, for posts that are not time-critical. Do not schedule a reply, a sold-out note, or a breaking correction. And do not schedule five posts in a row if you will not be present for the first one."),
            ("What about algorithms and the “first 30 minutes”?",
             "Plenty of people believe early conversation helps a post travel. X does not publish a complete ranking formula, and we will not invent one. What you can do is be present for the first replies, because the replies have value even if the distribution is unchanged."),
        ],
        ["how-to-reply-on-x-to-grow", "x-content-calendar-ideas", "how-to-grow-on-x-as-a-beginner", "how-to-write-an-x-thread"],
    )

    # ---------- 24. How to reply to grow ----------
    register(
        "problem",
        "how-to-reply-on-x-to-grow",
        "How to reply on X to grow",
        "Add a fact, a follow-up or a reasoned disagreement. Do not drop a pitch under a stranger.",
        "How to reply on X to grow (with example replies) · Netmend",
        "How to reply on X in a way that can help you get found: add a fact, ask a real follow-up, disagree with a reason. Examples included. No engagement bait, no pitching in strangers’ threads.",
        "X growth guides",
        "How to reply on X <span>to grow</span>",
        "Replies are how a lot of people actually discover a new account: they see a useful comment under a post they already care about. That only works if the reply is a contribution. “Great post! 🔥” plus a link to your service is not a contribution. It is litter.",
        paras(
            "Nobody can honestly promise that replies will grow an account, including us. What you can do is become the person whose comments are worth reading. Over time, some of those readers will follow you. Some will not. The work is still worth doing if you care about the topic.",
            "Pick conversations you know something about. Stay for a beat after you reply, in case the author answers. Do not mass-reply 40 posts with a variant of the same sentence. That pattern is obvious, and it is how accounts get muted.",
        )
        + "<h2>Replies that add something</h2>"
        + bullets([
            "<b>Add a fact or a step</b> the original post did not have, from work you have actually done.",
            "<b>Ask a follow-up that is specific</b> — a question the author can answer in one or two lines, not “thoughts?”.",
            "<b>Disagree with a reason</b>, and a limit. Name the part you disagree with. Do not attack the person.",
            "<b>Tell a short, relevant example</b>, clearly, without hijacking the thread into your memoir or your product.",
            "<b>Leave the pitch out.</b> If your profile and your posts explain what you do, people who want it can find it. A link-dump under a stranger’s post does the opposite of growth: it teaches people to hide you.",
            "<b>Credit and move on.</b> If you are only saying “this is right, and here is a smaller version of the same point”, consider whether the reply is needed at all.",
        ])
        + "<h2>Example replies (fictional parents in italics in the label)</h2>"
        + posts([
            ("Add a fact",
             "Original (paraphrase): “Bank feeds are enough; you do not need bookkeeping.”\n\nReply: “A bank feed is useful, and it is not the same thing as a reviewed set of books. Transfers still have to be matched, and the odd payments still have to be asked about. The feed is the input, not the review.”"),
            ("Specific follow-up",
             "Original: a founder describes hiding a feature behind a flag.\n\nReply: “Did you turn the flag off for new workspaces only, or for existing ones too? We did existing-only first, and support still got tickets from old accounts that expected the old button.”"),
            ("Disagree, with a reason",
             "Original: “Every consultant should post revenue in public.”\n\nReply: “I would not make that a rule. A dated decision is often more useful than a number, and some clients would be identifiable from a graph even if you never name them. If you do post a number, it should be one you can stand behind in a due-diligence room.”"),
            ("Short example, no pitch",
             "Original: a thread about onboarding drop-off.\n\nReply: “We had the same stall: people did not know whether to add a client or an invoice first. We hid the other buttons until one client existed. I will not pretend that is a universal fix, but it was the right fix for that screen.”"),
            ("What not to post",
             "Do not write: “Great thread! I help founders with onboarding — link in bio, 20% off this week.”\n\nIf you have something useful to say about onboarding, say the useful thing, and stop. The bio can do the rest."),
            ("When not to reply",
             "A stranger is posting about a bereavement, a medical crisis, or a fight you do not understand.\n\nYou do not need a clever contribution. You can keep scrolling. Growth is not a reason to walk into that thread."),
            ("Very short useful reply",
             "“The official page for this deadline is on the tax authority’s own site, and it is worth checking your own account against it. I would not take a date from a screenshot in a thread.”"),
            ("After they answer",
             "If the author replies to you, answer once, clearly, and do not drag the thread into a tour of your product.\n\nA short “that makes sense — we only did it for new workspaces, which is why I asked” is enough. You can always write your own post later."),
        ])
        + "<h2>Time and tone</h2>"
        + paras(
            "A small, repeatable habit beats a weekend binge: 15–20 minutes on a handful of posts you can actually add to. Mute words and accounts that pull you into fights. Do not pile on. Do not reply to a typo with a courtroom tone.",
            "If you want help drafting a careful disagreement or a factual add-on, paste the original post (only if you have the right to) and your point into the free X Post Writer, then cut anything that sounds like a pitch or a dunk. You still post the reply yourself.",
        ),
        [
            ("Is it acceptable to reply under large accounts every day?",
             "If you consistently add something, yes. If you are camping there with a slogan, no. People notice, including the author."),
            ("Should I tag the author?",
             "They will usually see the reply anyway if it is on their post. Extra tags, especially of uninvolved people, look like a grab for attention."),
            ("Can replies replace writing my own posts?",
             "They can start discovery. They are a weak substitute for having a profile and a few posts that show how you think. Do both, lightly."),
        ],
        ["how-to-get-more-replies-on-x", "how-to-grow-on-x-as-a-beginner", "x-hook-formulas", "how-to-write-x-posts-in-your-own-voice"],
    )

    # ---------- 25. Bio examples ----------
    register(
        "problem",
        "x-bio-examples",
        "X bio examples",
        "Who it is for, what you do, and how to go further — without a fake metric.",
        "X bio examples (clear, honest profiles you can adapt) · Netmend",
        "X bio examples for founders, freelancers, advisors and shops: who it is for, what you do, and a link. No fake follower counts or invented titles.",
        "X growth guides",
        "X bio <span>examples</span>",
        "A bio has a short, unforgiving job: tell a stranger who you help, what you do, and where to go next. Jokes, slogan adjectives and fake metrics waste that space. You can be dry and still be memorable if the line is specific.",
        paras(
            "You do not need a hook worthy of a billboard. You need one sentence a sharp stranger would not have to reread, plus a way to go further (a site, a shop, a booking page). If you are on a personal account and a professional one, say which this is. Do not invent a title, a credential, a follower count, or a “featured in” line.",
            "Names and handles are not part of the examples below. The structure is. Swap in your real facts, and nothing else.",
        )
        + "<h2>What usually belongs in a bio</h2>"
        + bullets([
            "<b>Who you help, or the job you do</b>, in words a stranger uses. “I write X posts for dentists” is clearer than “storyteller / visionary”.",
            "<b>A constraint or a place</b> if it matters: a city, a jurisdiction, “adults only”, “UK tax”, “no medical advice here”.",
            "<b>One proof that is real</b> (a book title, a product name, a registration you actually hold). Skip it if you would have to inflate it.",
            "<b>A link.</b> The bio link should go where you actually want the click: the site, the product, the booking form. Not a pile of five unlabelled links if you can help it.",
            "<b>What this account is not</b>, when that prevents harm: “Not legal advice”, “Not a clinic”, “I do not take job pitches in DMs”.",
        ])
        + "<h2>Example bios, with a note on why</h2>"
        + posts([
            ("SaaS founder",
             "Plain-language invoicing for sole traders who already have a bank CSV. I write about what we ship, and what we will not build.\n\nWhy it works: the user and the file are named. There is no “revolutionising finance”."),
            ("Freelance designer",
             "Brand and web design for small B2B firms. Five-page marketing sites, fixed-scope proposals, two rounds of revisions. Portfolio in the link. No “quick calls” without a brief.\n\nWhy it works: the package and a boundary are visible before a DM."),
            ("Dentist / clinic (general info)",
             "General dental practice in Leeds. This account is for clinic hours, plain-language explanations, and public information. Appointments: use the practice number or the form on the site, not a DM. Not a diagnosis.\n\nWhy it works: it sets the channel and the limit."),
            ("Accountant",
             "Chartered accountant, England and Wales. General posts about records, deadlines and how we work. Not personal tax advice. Enquiries: the firm’s email in the link.\n\nWhy it works: credential, limit, and a proper channel."),
            ("Author",
             "Novels and essays. Next book: The Quiet Harbour, 3 March. Process notes are here; the buy link is in the site. I do not review unpublished manuscripts in DMs.\n\nWhy it works: the dated fact, the link job, and a boundary."),
            ("Recruiter",
             "In-house recruiter, product and design roles, Manchester, hybrid two days a week. I post live roles with a salary range, or I do not post them. Applications: the official form, not a DM of a CV screenshot.\n\nWhy it works: the mandate and the process are clear."),
            ("Therapist (careful)",
             "Counsellor for adults, online. In a live bio, name the register you actually belong to; this example does not invent one. This is not a therapy service and not a crisis line. Enquiries through the contact form only. If you are in immediate danger, contact emergency services.\n\nWhy it works: it prevents the account being mistaken for a clinic."),
            ("A bio to avoid",
             "“CEO | Investor | Speaker | Thought leader | 10x | Husband | Opinions my own | DM for collabs | 🚀”\n\nThis is a pile of titles, a fake-flex, and no reader. If you need a personal line, one true one is enough: the job, the city, or the product."),
        ])
        + "<h2>Display name, picture, and the first posts</h2>"
        + paras(
            "Use a name people can say and search for. A face or a clear mark is easier to recognise than a dark, cropped logo, but that is your choice; some professions prefer a mark. The first visible posts should match the bio. If the bio says you write about shipping a product, the pin should not be a year-old joke.",
            "The free X Post Writer will not write your bio for you as a special mode, but you can paste a messy paragraph about your work and ask for 10 shorter versions, then edit out any invented credential. Read the result against your actual job title and your regulator, if you have one.",
        ),
        [
            ("How long should a bio be?",
             "Short enough to read on a phone without effort. One tight paragraph, or two very short ones, is enough. If you need a CV, that belongs on the site."),
            ("Should I put a price in the bio?",
             "If the price is stable and you want that filter, yes. If it varies, describe how you work and put figures on the site."),
            ("Can I joke?",
             "A small joke is fine if the job is still clear. If the joke needs explaining, or if it muddies a regulated role, cut it."),
        ],
        ["how-to-grow-on-x-as-a-beginner", "how-to-write-x-posts-in-your-own-voice", "x-post-ideas-for-freelancers", "x-hook-formulas"],
    )

    # ---------- 26. How to write an X thread ----------
    register(
        "problem",
        "how-to-write-an-x-thread",
        "How to write an X thread",
        "When a thread is the right shape, and how to build one that is easy to finish.",
        "How to write an X thread (a practical structure) · Netmend",
        "How to write an X thread: when to use one, how to structure it, and original examples. Shorter than your enthusiasm. No virality promises.",
        "X growth guides",
        "How to write an <span>X thread</span>",
        "A thread is a good shape when you have a sequence: a method, a story with more than one turn, or a list that would be cramped in a single post. It is a bad shape when you have one idea and you are stretching it so it looks like a “thread”.",
        paras(
            "If you came here because you want a thread to travel widely, read the companion page on writing a so-called viral thread as well. The craft is the same. The honest limit is the same: you can make a thread easy to read, you cannot order it to spread.",
            "Standard accounts still work in a short character budget per post; longer posts exist on paid X plans. Check the counter in your own composer. Either way, one idea per post is easier to read on a phone than a wall of text split at random.",
        )
        + "<h2>Build it in this order</h2>"
        + bullets([
            "<b>Write the point in one sentence.</b> If you cannot, you are not ready to thread it.",
            "<b>List the posts as headings</b> (five to eight at most, often fewer). Each heading is one idea.",
            "<b>Write the first post last.</b> It has to stand alone in the feed, with a concrete hook.",
            "<b>Write the middle in order.</b> Steps, examples, a failed attempt, a limit. Number them if the sequence matters.",
            "<b>Write a finish</b> that is a takeaway or a next step, not a cliff-hanger for “part 2” you have not written.",
            "<b>Cut.</b> Read it once without mercy. Any post that only says “as I mentioned” goes.",
        ])
        + "<h2>Example threads and shapes</h2>"
        + posts([
            ("Method thread, 5 posts",
             "1/ A freelance project I will not start without a written brief any more. The brief is four lines.\n\n2/ What already exists: files, logins, brand, earlier drafts.\n\n3/ What “done” looks like, in deliverable files, not in a feeling.\n\n4/ The drop-dead date, and why it is that date.\n\n5/ Who signs off — one name. If those four lines cannot be written, we do not book a kickoff call. That is the whole method."),
            ("Story thread, 4 posts",
             "1/ We had a ticket we answered 40 times in October, and it was not a bug.\n\n2/ People were pasting an API token into the workspace ID field. The docs said not to. The docs were not being read at that moment.\n\n3/ We relabelled the field, put an example value in the box, and rejected tokens with a specific error.\n\n4/ Tickets dropped. The lesson I kept: if a mistake repeats, change the interface, not only the help article."),
            ("List thread, 4 posts",
             "1/ Four things I put in a product page before any adjective.\n\n2/ What it is made of, and a limit of the material (this jumper shrinks if you tumble it).\n\n3/ When it ships, in dates I can keep, not “ASAP”.\n\n4/ How a return works, in the same words as the official policy. The adjectives can come after those four, or not at all."),
            ("When not to thread",
             "If the second post is only a punchline, you have a single post.\nIf you are repeating the same idea in new words, you have a single post.\nIf the useful part is a link, write one post and the link, not a runway of empty posts."),
            ("First post, weak vs stronger",
             "Weak: “Some thoughts on briefing, a thread.”\n\nStronger: “I will not start a freelance project without a four-line brief any more. Here are the four lines, and what I do if they cannot be written.”"),
            ("Numbering",
             "Numbering helps when the order matters (a method, a timeline). It is optional when you are offering a set of examples. If you number, keep the count honest: do not write “1/17” and then run out of material at 6."),
            ("A finish",
             "Useful: “That is the whole method. I use it on website projects; your trade may need different lines.”\n\nLess useful: “Follow me for part 2, where I reveal the template.” If the template is the point, it belongs in this thread, or in a linked page."),
            ("Editing pass",
             "Read only post 1. Would you open the rest?\nRead only the last post. Does it close, or does it fade out?\nRead the middle on a phone preview. Cut a post. If nothing breaks, leave it cut."),
        ])
        + paras(
            "If you want 10 short-thread drafts in your tone, choose “short threads” in the free X Post Writer, paste a few of your old posts and the outline, and then cut. The tool will happily invent a sixth step you do not use. Remove it.",
        ),
        [
            ("Single post or thread?",
             "If one screen can hold the idea without cramping, use a single post. Threads cost the reader a click. Spend that click only when the sequence needs it."),
            ("Can I add images to each post?",
             "Yes, if each image earns its place (a diagram, a screenshot you are allowed to show). Decorative images on every post slow people down."),
            ("Should I pin a thread?",
             "Pin one that still describes the work you do. A dated fight or a one-week promotion is a poor pin."),
        ],
        ["how-to-write-a-viral-x-thread", "x-hook-formulas", "x-post-ideas-for-consultants", "how-to-write-x-posts-in-your-own-voice"],
    )

    # ---------- 27. More replies ----------
    register(
        "problem",
        "how-to-get-more-replies-on-x",
        "How to get more replies on X",
        "Ask a real question, leave room, and do not bait. Replies are not a prize you can order.",
        "How to get more replies on X (without engagement bait) · Netmend",
        "How to get more replies on X: ask a real question, be specific, stay for the conversation. No engagement bait, no promised metrics.",
        "X growth guides",
        "How to get more <span>replies on X</span>",
        "Replies happen when a post is easy to answer, or hard to leave alone because it is specific. They do not happen reliably because you wrote “agree?” or “comment YES if you want the guide”. That is bait, and people have learned to ignore it — or to punish it.",
        paras(
            "You cannot, and we cannot, guarantee a reply count. What you can do is remove the usual reasons a post gets silence: it is vague, it is a lecture with no opening, it asks too large a question, or you disappear after posting so the first reply sits alone.",
            "A good question is narrow, about a situation the reader has lived, and possible to answer in one or two sentences. “What do you think about the future of work?” is not a good question. “Did you turn the feature flag off for existing workspaces, or only for new ones?” is.",
        )
        + "<h2>Ways to leave room for a reply</h2>"
        + bullets([
            "<b>Ask a narrow, lived question</b> after a specific example, not instead of one.",
            "<b>Offer a distinction</b> and invite people to say which side they are on, with a reason. Two clear options beat a vague “thoughts?”.",
            "<b>Publish a method and ask where it would break</b> in someone else’s trade.",
            "<b>Stay for the first half-hour</b> and reply to the people who answered you. Conversation often draws more conversation. That is a tendency, not a law.",
            "<b>Do not ask for a ritual.</b> “Comment the word GUIDE.” “Like if you agree, RT if you really agree.” These train people to see you as a shop, not a writer.",
            "<b>Do not demand labour.</b> A question that needs a 500-word answer, in public, from a stranger, is usually too much to ask.",
        ])
        + "<h2>Example posts that leave a real opening</h2>"
        + posts([
            ("Narrow question after a fact",
             "We hid every button on the home screen until the user adds one client. Trial drop-off at that step is the thing we are trying to move.\n\nIf you have tried a similar empty state, did you hide the other actions, or did you leave them visible and just change the copy?"),
            ("Two options, with reasons invited",
             "For year-end packs, we ask for everything eight weeks before the filing date.\n\nI know some firms ask at four. If you run this, which window do you use, and what actually arrives late — bank statements, or the “odd” items?"),
            ("Where would this break?",
             "A freelance brief, for me, is four lines: existing files, definition of done, a real date, and one person who can sign off.\n\nIf you work in a trade where that would fail, I would like to know which line breaks first."),
            ("Invite a correction",
             "I am writing a general note about Sunday buses on this street: the 45 is every 30 minutes, first one at 07:12.\n\nIf that has changed this timetable, tell me, and I will correct the post. I would rather be boring and right."),
            ("What not to write",
             "“Want my freelance brief template? Comment BRIEF and I will DM it to everyone.”\n\nIf you have a template, put it on a page and link it once. The ritual is not a conversation; it is a scrape of addresses."),
            ("A lecture with a door",
             "I no longer start a project without a written brief. A kickoff call with no agenda was how three jobs went wrong last year.\n\nIf you still kick off on a call only, I am interested in how you stop the brief from drifting — genuinely, not as a trap."),
            ("Very short opening",
             "If you invoice in euros, does your CSV export still use a decimal point, or did you get the comma right?\n\nI am asking because we just shipped the comma, and I would like to know where it still breaks."),
            ("After the first reply",
             "When someone answers you, answer the content of what they said. Quote the specific bit. Do not paste a thank-you and a link.\n\nIf the thread is going somewhere useful, you can write a later post that summarises what you heard, and credit the people who added a fact."),
        ])
        + paras(
            "If drafting the question is the hard part, use the free X Post Writer: paste the body of your post and ask for versions that end on a narrow question. Then pick the question you would actually like to hear answered, not the one that sounds most “engaging”.",
        ),
        [
            ("Are questions always better than statements?",
             "No. A sharp statement often gets more thoughtful replies than a weak question. Use a question when you actually want the answer."),
            ("Should I reply to every reply?",
             "Reply to the ones that add something, and to good-faith questions. You do not owe a debate to a drive-by. You do owe a correction if someone points out a fact you got wrong."),
            ("Does asking for retweets help?",
             "A clear “if this is useful, a repost helps it travel” is honest, and easy to ignore. Ritual bait is worse. Neither is a substitute for a post worth sharing."),
        ],
        ["how-to-reply-on-x-to-grow", "x-hook-formulas", "how-to-write-an-x-thread", "how-to-grow-on-x-as-a-beginner"],
    )

    # ---------- 28. Beginner growth ----------
    register(
        "problem",
        "how-to-grow-on-x-as-a-beginner",
        "How to grow on X as a beginner",
        "A profile, a handful of useful posts, and replies you can stand behind. No bought followers.",
        "How to grow on X as a beginner (a practical path) · Netmend",
        "How to grow on X as a beginner: set up a clear profile, write useful posts, reply with substance. No bought followers, no promised timelines.",
        "X growth guides",
        "How to grow on X as a <span>beginner</span>",
        "If you are starting from a small or empty account, the job is not to “hack the algorithm”. It is to be findable and worth reading: a clear bio, a few posts that show how you think, and replies in conversations you actually know something about. Growth, if it comes, is a side-effect.",
        paras(
            "There is no honest timeline for this, and we will not invent one. Accounts grow at very different speeds depending on the topic, the luck of a single post, and whether the person already has an audience elsewhere. Anyone selling you a follower package, a “growth pod”, or a guaranteed schedule is selling you a problem.",
            "Do the simple work consistently for a month before you judge the channel. If after that you still hate it, you are allowed to stop.",
        )
        + "<h2>A beginner path that does not rely on tricks</h2>"
        + bullets([
            "<b>Fix the profile first.</b> A name people can search, a bio that names the job and who it is for, a link that works, and a pin that still describes you. See the bio examples on this hub.",
            "<b>Write five to ten posts that could live for a month:</b> a method, a process, a lesson from work, a definition, a limit of what you do. These are the posts a new visitor will see.",
            "<b>Pick a pace you can keep.</b> Three good posts a week will beat a seven-day burst and a silence. There is no required daily quota.",
            "<b>Spend a short, fixed time on replies</b> — 15–20 minutes — in topics you know. Add a fact, a follow-up, or a reasoned disagreement. Do not pitch.",
            "<b>Talk to people, not at “the algorithm”.</b> Follow a modest number of people whose work you actually read. You do not need to follow thousands, and you should not mass-follow.",
            "<b>Ignore the usual traps:</b> bought followers, engagement pods, giveaway-for-a-follow schemes, and tools that post bait on your behalf.",
        ])
        + "<h2>Example first posts for a new account</h2>"
        + posts([
            ("Who I am, without a slogan",
             "I design five-page marketing sites for small B2B firms, on a fixed-scope proposal, with two rounds of revisions.\n\nI will write here about briefs, scope, and the work itself. If you need a “vision workshop” with no deliverable, I am the wrong person."),
            ("A method",
             "I will not start a project without a four-line brief: what already exists, what “done” looks like in files, the real date, and one person who can sign off.\n\nIf those lines cannot be written, we do not book a kickoff call."),
            ("A limit",
             "I do not give personal tax advice on this account.\n\nI will post general notes about records and how our firm works, in England and Wales, and I will point you to the official pages when I cite a date. Enquiries go to the firm’s email, in the link."),
            ("A lesson from work",
             "Three jobs that went wrong last year had the same first week: a call, no written brief, and “we will know it when we see it”.\n\nI now send the brief back for a yes before I open the file."),
            ("A reply, as a beginner",
             "Under a post about onboarding: “We stalled in the same place — people did not know whether to add a client or an invoice first. We hid the other buttons until one client existed. Not a universal fix, but it was the right one for that screen.”\n\nNo link. No “I help with onboarding”."),
            ("What not to lead with",
             "“New here! Please follow me, I post about hustle, mindset and 10x growth every day.”\n\nThis tells a stranger almost nothing, and it asks for a favour before you have been useful. Write one useful post first. The follow is their decision."),
            ("A quiet weekly cadence",
             "A sustainable week, for many people, looks like this:\n\n- One process or method post.\n- One example or lesson from work.\n- One short observation, or a reply-heavy day with no new post.\n\nAdjust it. The point is a pace you still keep in week four."),
            ("Very short hook",
             "You do not need a growth hack to start on X.\n\nYou need a clear bio, a handful of posts you are still happy with in a month, and replies you would also stand behind if they were screenshotted."),
        ])
        + paras(
            "When you have a messy idea and a couple of old emails or posts that sound like you, the free X Post Writer can give you 10 drafts to edit. It will not grow the account for you, and it should not be used to flood the feed with 10 near-duplicate posts in an hour. Pick one. Schedule nothing you will not be present for.",
        ),
        [
            ("How many followers do I need before it is “working”?",
             "There is no threshold. A hundred people who care about your trade are more useful than a thousand who were bought or baited. Look at whether the replies are serious, not only at the count."),
            ("Do I need to post every day?",
             "No. A pace you can keep, with posts you would still sign in a month, is enough to start. Daily posting is a choice, not a rule."),
            ("Should I tell people I am new?",
             "You can, once, if it is true and light. Do not make “new here, please welcome me” the pin. Let the work introduce you."),
        ],
        ["x-bio-examples", "how-to-reply-on-x-to-grow", "x-content-calendar-ideas", "how-to-write-x-posts-in-your-own-voice"],
    )

    # ---------- 29. Content calendar ----------
    register(
        "problem",
        "x-content-calendar-ideas",
        "X content calendar ideas",
        "A four-week rotation of post types you can actually keep, not a 5-posts-a-day grid.",
        "X content calendar ideas (a four-week rotation you can keep) · Netmend",
        "X content calendar ideas: a four-week rotation of process posts, examples, questions and news, with original examples. A pace you can keep, not a 5-a-day grid.",
        "X growth guides",
        "X content calendar <span>ideas</span>",
        "A calendar is useful when it stops you staring at a blank box. It is harmful when it forces five posts a day you do not believe in. The version below is a four-week rotation of post types, at a pace many working people can keep: a few posts a week, plus time to reply.",
        paras(
            "Reuse the types, not the sentences. Every post still needs your own facts. If a week is busy, skip a slot rather than publish a hollow one. If something time-critical happens (a ship, a sold-out dish, a deadline), that post replaces the planned one.",
            "This is a starting pattern, not a rule, and not a promise that a calendar will grow an account.",
        )
        + "<h2>A four-week rotation (about 3 posts a week)</h2>"
        + facts([
            ("Week 1", "Monday: a process or method. Wednesday: a concrete example from work (anonymised or fictional and labelled). Friday: a narrow question, or a short observation."),
            ("Week 2", "Monday: a definition or a distinction in your trade. Wednesday: a limit — what you do not do, or a constraint of the product. Friday: a ship, a restock, a deadline, or a useful reply turned into a post."),
            ("Week 3", "Monday: a lesson from something that went wrong. Wednesday: a checklist or anatomy (the parts of a brief, a session, a listing). Friday: a short thread if, and only if, you have a sequence."),
            ("Week 4", "Monday: a before-and-after of a brief, a page, or a process (with permission). Wednesday: a myth you still hear, corrected carefully. Friday: one clear, dated announcement if you have one; otherwise a process post you have not used yet."),
        ])
        + paras(
            "Alongside the posts, keep a 15–20 minute reply window on the days you publish, in your audience’s time zone if you can. The calendar does not replace conversation.",
        )
        + "<h2>Example posts, one for each type</h2>"
        + posts([
            ("Process (week 1, Monday)",
             "For a copywriting job I do this, in order: a 45-minute kickoff and a written outline you approve; a first draft and one structured revision; final files in Docs and Markdown.\n\nIf legal needs a pass, we add it at the outline stage, not after the “final” draft."),
            ("Example from work (week 1, Wednesday)",
             "Last month I rewrote a pricing page. The constraint was: no new screenshots, no invented case studies, and the three plans had to stay as they were.\n\nMost of the work was putting the limits (seats, log retention, support hours) in the same order on every plan."),
            ("Narrow question (week 1, Friday)",
             "For year-end, we ask for the pack eight weeks before the filing date. Some firms ask at four.\n\nIf you run this, which window do you use, and what actually arrives late?"),
            ("Distinction (week 2, Monday)",
             "A bank feed is useful, and it is not the same thing as a reviewed set of books.\n\nSomeone still has to match transfers and ask about the odd payments. That is the work, not the fact that the bank is connected."),
            ("A limit (week 2, Wednesday)",
             "I do not offer unlimited revisions.\n\nUnlimited sounds generous. It usually means the brief was never finished. I write “two rounds” in the statement of work, and a day rate after that."),
            ("A lesson from a failure (week 3, Monday)",
             "Three projects that went wrong last year had the same first week: a kickoff call, no written brief, and “we will know it when we see it”.\n\nI now send a one-page brief back for a yes before I open the file."),
            ("Myth, carefully (week 4, Wednesday)",
             "“I can run my personal shopping through the company if I take it out later” is a sentence that causes mess.\n\nWhat you may or may not put through a company depends on the rules and on your facts. Ask your accountant before you invent a method. This is general information, not advice on your books."),
            ("When to break the calendar",
             "The mackerel is gone for today.\n\nThe soup and the schnitzel are still on. Kitchen until 14:30.\n\n(This replaces Friday’s planned question. Fresh facts win.)"),
        ])
        + paras(
            "Batch the drafting if that helps: one hour on a Sunday to sketch the three posts, then a final pass on the day with any new fact. The free X Post Writer can turn each sketch into 10 tones. Do not fire all 10 into the week. Pick one per slot, and leave yourself room to be present.",
        ),
        [
            ("Is three posts a week enough?",
             "For many people, yes. A kept pace is better than an ambitious grid you abandon. If you have more to say and you can stay for replies, add a slot. Do not add empty ones."),
            ("Should I plan a month in a spreadsheet?",
             "If it calms you, yes: type, not full copy, so you can swap in fresh facts. A rigid script of 30 finished posts usually goes stale."),
            ("What about weekends?",
             "Only if your audience is actually around and you want to be. Many trades do better if you rest and come back on Monday with something solid."),
        ],
        ["best-time-to-post-on-x", "how-to-grow-on-x-as-a-beginner", "x-hook-formulas", "x-post-ideas-for-saas-founders"],
    )

    # ---------- 30. Write in your own voice ----------
    register(
        "problem",
        "how-to-write-x-posts-in-your-own-voice",
        "How to write X posts in your own voice",
        "Use your own sentences as the sample. Cut anything a tool invented that you would not say.",
        "How to write X posts in your own voice (with examples) · Netmend",
        "How to write X posts in your own voice: sample your own sentences, keep your diction, cut tool-invented polish. Original examples, plus a free in-browser writer.",
        "X growth guides",
        "How to write X posts in <span>your own voice</span>",
        "Voice, on X, is not a brand adjective. It is the pattern in your sentences: how long they are, whether you use jokes, how formal you are, whether you say “I” or “we”, whether you hedge. The fastest way to lose it is to paste a topic into a generic tool and publish the polished, nobody-in-particular result.",
        paras(
            "The way back is simple, and slightly slower: start from words you have already written, then draft, then cut anything you would not say out loud to a sharp peer. A tool can help with structure and with volume. It cannot be you, and it should not be allowed to invent a figure or a softness you do not use.",
            "This is also the job the free X Post Writer was built for. You paste a handful of your old posts as a voice sample, then a messy idea, and it drafts 10 options in that direction. You still have to edit.",
        )
        + "<h2>A practical method</h2>"
        + bullets([
            "<b>Collect 5–15 posts, emails or paragraphs you already like.</b> Prefer ones real people have already seen. Include a reply or a tight explanation, not only announcements.",
            "<b>Name three traits, privately:</b> for example “short sentences, dry, no emoji”, or “warmer, I use ‘we’, I explain the why”. This is a check, not a manifesto.",
            "<b>Write a messy first pass</b> of the new idea, in the words you would actually use, even if it is ugly.",
            "<b>Only then use a tool or a structure</b> (a hook formula, a thread shape, or the X Post Writer) to get variations.",
            "<b>Read each draft out loud.</b> Cut the adjectives you never say, the false intimacy, the fake number, the “excited to announce”, the Americanism you do not use, or the formality you do not use.",
            "<b>Keep one draft.</b> Publishing four near-duplicates in a day does not sound like a voice. It sounds like a machine.",
        ])
        + "<h2>The same fact, three voices (all fictional)</h2>"
        + posts([
            ("Drier, shorter",
             "We hid every button on the home screen until the user adds one client.\n\nPeople were stalling on “what do I do first?”. This is the fix we are testing. I will post if the drop-off moves, not before."),
            ("Warmer, still specific",
             "The most common first-session question we saw was “do I add a client or an invoice first?” — and we had given them both buttons, like that was helpful.\n\nWe now ask you to add a client, and we hide the rest until you have. If you try it and it feels worse, I want to hear it."),
            ("More formal",
             "We changed the empty state of the workspace. Until one client record exists, other actions are hidden.\n\nThe aim is to remove an ambiguous first step that showed up repeatedly in trial drop-off. I will report the result when we have two weeks of data."),
            ("A voice you should not borrow",
             "“Folks, I am SUPER excited to share that we just 10x’d onboarding by leveraging a delightful empty-state journey!! 🚀”\n\nIf you do not talk like this, do not let a tool talk like this in your name. Also, “10x’d” needs a baseline you probably do not have in this sentence."),
            ("Where voice actually lives",
             "It lives in: sentence length, hedging (“I think”, “usually”), humour, whether you name the messy part, whether you use contractions, whether you say “I” or hide behind “one”.\n\nIt does not live in a list of brand values. If those values never appear in your ordinary email, they will not appear, honestly, in a post."),
            ("Editing pass",
             "Read the draft next to one of your old posts.\nIf the new one is suddenly full of “unlock”, “journey”, “game-changer”, or a statistic you did not type, cut.\nIf the new one is suddenly stiffer than you ever are, cut the starch, not the fact."),
            ("When you write in public for a firm",
             "Agree, in writing if you can, what “we” may say: no client names, no unofficial legal positions, no unauthorised financial promotions.\n\nYour personal sharpness can still show, inside that fence. The fence is not the same thing as sounding like a brochure."),
            ("Very short hook",
             "If you would not say it to a sharp peer, do not post it.\n\nThat rule removes most of the fake voice problems on its own."),
        ])
        + paras(
            "Open the free X Post Writer, paste the sample, paste the idea, and generate a batch. Then do the out-loud pass. If you want to lift the daily cap later, a lifetime license is $19 for the first 50, then $29, paid once on Gumroad. The free 3-a-day tool remains either way. No version of the tool will post for you, and no version can promise that a post in your voice will travel.",
        ),
        [
            ("What if I do not have old posts yet?",
             "Use emails, a proposal, a README, a lesson you already taught. The sample only has to be writing that already sounds like you. If you have none, write three short posts by hand first, then start sampling those."),
            ("Can I be two voices, personal and professional?",
             "Yes, if you are clear which account is which, and you do not mix them in a way that surprises a client or a regulator. Each account still needs a consistent sample."),
            ("Why 10 drafts, not one?",
             "Because the first draft a model produces is often the most generic. Looking at ten, then keeping one you would actually say, is the point of the tool — not publishing ten."),
        ],
        ["x-hook-formulas", "x-bio-examples", "how-to-write-an-x-thread", "how-to-grow-on-x-as-a-beginner"],
    )
