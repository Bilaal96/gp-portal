<script setup lang="ts"></script>

<template>
    <div>
        <h1 class="mb-2 text-2xl font-bold">Address & Contact Info</h1>

        <p class="mb-4">
            Please provide your contact information so we can get in touch with
            you regarding appointments & health concerns.
        </p>

        <!-- Address -->
        <!-- No fixed address - checkbox 
            * legal requirement for the homeless - cannot refuse registration if applicant does not have fixed address

            * unchecked (default) - shows Fixed Address inputs (see below)
            * checked 
                - hides fixed address input
                - use clinic address as temporary address
        -->

        <!-- Fixed address fields - input:text -->
        <div id="address-fields">
            <!-- First line -->
            <!-- Second line (optional) -->
            <!-- City -->
            <!-- Post Code -->
        </div>

        <!-- Phone - input:text with inputmode=numeric & pattern=[0-9*] -->
        <!-- Phone landline - (optional) - input:text with inputmode=numeric & pattern=[0-9*] -->

        <!-- Contact email input:email 
            * may be different to account registration email 
            * REVIEW: 
            * use personal.accountEmail as contact.email   
                - either prompt to leave blank - if empty fallback to personal.accountEmail
                - [preferred] use checkbox to signal use of persona.accountEmail
        -->

        <!-- Preferred contact method - checkbox group - options:
            * Phone
            * SMS
            * Email
            * Letter
        -->
    </div>
</template>
