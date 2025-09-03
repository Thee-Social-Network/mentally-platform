# lost-and-found

build a USSD /messaging for a website so that people who dont have smart phones can book psychologist
Thinking
Kicking off 10 searches
Looking at 128 sites
Putting it all together
Building a USSD (Unstructured Supplementary Service Data) and SMS messaging system for a website involves using a third-party gateway to connect with mobile network operators
. This allows non-smartphone users to interact with your website's booking system via simple text-based menus.
Here is a step-by-step guide to building this functionality:
1. Choose an SMS/USSD gateway provider
Instead of setting up your own connection with mobile network operators, a gateway provider simplifies the process. These providers offer an API to connect your website to their messaging infrastructure.
When choosing a provider, consider:

    Pricing model: Some providers charge per message, while others have volume-based pricing.
    Features: Ensure they support both two-way SMS messaging and USSD functionality.
    Developer support: Look for well-documented APIs and tutorials to aid integration.
    Customer support: Check for responsive and local support if you are operating in a specific region.

Top Bulk SMS Platforms in South Africa: Local Gateways Compared
Jun 2, 2025 — List of SMS Platforms in South Africa * Trembi Campaigns. * SMS Portal. * Clickatell. * BulkSMS. * Everlytic. * Africastalking. Best Bulk SMS Platforms in South...
Favicon
Trembi
Integrating USSD With Your Applications - arkesel.com
Aug 7, 2024 — Requirements for integrating USSD * USSD gateway: This is a service that enables communication between your application and the mobile network provider's USSD p...
Favicon
Arkesel
Examples of providers in the South African context (based on search results):

    Africa's Talking: A developer-focused platform offering SMS, Voice, and USSD APIs.
    Connect Mobile: Provides a USSD gateway with hosted application development options.
    Panacea Mobile: Offers a self-service USSD gateway and API with specific pricing for South Africa.

2. Design the USSD menu flow
The user's journey through your booking system must be simple and logical, as they will only be interacting with text-based menus.
Example USSD menu flow:

    User dials code: The user dials your dedicated USSD code, such as *120*123#.
    Initial welcome: The system responds with a welcome message, e.g., "Welcome to Psych Connect. Reply with: 1 to Book, 2 for Info."
    Booking selection: The user replies 1.
    Date selection: The system asks for the booking date, e.g., "Select a day: 1 Mon 2 Tue 3 Wed 4 Thur 5 Fri."
    Time selection: After the user replies with their chosen day, the system shows available time slots, e.g., "Available times: 1 10:00 2 14:00 3 16:00."
    Confirmation: The system confirms the booking details and asks the user to confirm, e.g., "Confirm your booking for Mon at 14:00? 1 Yes 2 No."
    Final confirmation: The system sends a final confirmation message and can offer an option to receive an SMS reminder.
