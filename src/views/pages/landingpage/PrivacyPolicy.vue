<script setup lang="ts">
import Appbar from './Components/AppBarMenu.vue';
import FooterSection from './Components/FooterSection.vue';
import NewsLetter from './Components/NewsLetter2.vue';
import { useCustomizerStore } from '@/stores/customizer';
const customizer = useCustomizerStore();
</script>

<template>
  <v-layout class="flex-column" :class="customizer.actTheme === 'dark' ? 'bg-containerBg' : 'bg-surface'">
    <Appbar />
    <v-row class="justify-center">
      <v-col cols="12" class="py-0">
        <v-main class="mx-0 pt-16 pb-0 position-relative overflow-hidden">
          <div class="bg-blur">
            <div class="round-1"></div>
            <div class="round-2"></div>
          </div>
          <v-container class="maxWidth">
            <v-row class="justify-center py-10">
              <v-col cols="12" md="5" sm="6">
                <div class="text-center position-relative pt-3">
                  <h2 class="text-h2 mb-2">Privacy Policy</h2>
                  <p class="text-h6 text-lightText mb-0">Last updated August 2, 2024</p>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-main>
      </v-col>
      <v-col cols="12" md="8" lg="7" class="pt-0">
        <div class="py-md-16 py-8 px-4">
          <v-card class="pa-6 text-body-1" variant="text">
            This Privacy Policy governs the manner in which Demos: A Network for Ideas and Action, Ltd. (“Demos”, “Us” or “We”) collects,
            uses, maintains, and discloses information collected from users (“Users” or “You”) of its website located at www.demos.org (the
            “Website”).
            <h3 class="text-h3 my-4">The Types of Information Demos Collect</h3>
            <ul class="ms-5 my-5">
              <li>Non-personally identifiable information</li>
            </ul>
            <p>
              Demos may collect non-personally identifiable information about you whenever you visit the Website. Such information may
              include the Internet Protocol (IP) address of the computer you used, the type of browser and operating system you used, the
              date and time you visited the Website, the Internet address of the site from which you linked to the Website, and which pages
              you viewed on the Website.
            </p>
            <ul class="ms-5 my-5">
              <li>Web browser cookies</li>
            </ul>
            <p>
              Demos may use “cookies” to enhance your experience with the Website. A cookie is a small text file that is stored in your
              computer so that the Website can recognize you and keep track of your preferences. Use of cookies help to measure aggregate
              web statistics, such as collecting the number of Users to the Website, the number of repeat Users and the most popular
              webpages, to serve relevant content to a User as he/she browses the Internet, and for other purposes. You may choose to set
              your web browser to refuse cookies, or to alert you when cookies are being sent. If you do so, however, some parts of the
              Website may not function properly.
            </p>
            <h3 class="text-h3 my-4">Personally identifiable information</h3>
            <p>
              Demos, on its own and through select third party vendors, collects personally identifiable information, such as names, email
              addresses, mailing addresses and credit card information, from Users when they voluntarily provide such information to us,
              including, for example, when a User signs up to join our email list, purchases tickets to an event, completes the contact
              form, responds to a job posting, or donates money via the Website. Complete credit card information, however, is not stored.
            </p>
            <h3 class="text-h3 my-4">How Demos Uses the Information that it Collects</h3>
            <p>
              Demos uses Users’ personal information to better understand how Users use the Website so that we can improve the Website and
              its offerings. Demos also uses Users’ personal information for the purpose for which the Users provided the information, in
              other words, for example, to add you to our email list, to process your request for tickets to an event, to respond to your
              inquiry, to consider you for a job, or to process your donation. If you affirmatively opt-in to our email list, we will add
              you to our list. If at any time you wish to stop receiving emails from us, please follow the unsubscribe instructions at the
              bottom of any email Demos sends you.
            </p>
            <h3 class="text-h3 my-4">How Demos Protects User Information</h3>
            <p>
              Demos adopts appropriate data collection, storage, and processing practices and security measures to help protect against
              unauthorized access, alteration, disclosure or destruction of your personal information, but Demos cannot guarantee that your
              information is 100% secure. Your credit card information is not stored by Demos.
            </p>
            <h3 class="text-h3 my-4">Sharing Personal Information</h3>
            <p>
              We use third party service providers, including, for example, Mailchimp, Rallybound, EventBrite and HiringThing, to help us
              operate the Website and administer activities on our behalf, such as collecting donations online and registering Users for
              events. These third party vendors may have access to User information, which becomes subject to their individual privacy
              policies. In addition, Demos shares personal information about Users with Demos Action, our sister organization. Demos may
              also share personal information with other like-minded organizations. In addition, Demos will share personally identifiable
              information about Users when required to do so by law, or in the good faith belief that such action is necessary to comply
              with state and federal laws or to respond to a court order, subpoena, or search warrant.
            </p>
            <br />
            <p>
              Demos will also share personally identifiable information if it believes it is necessary to protect the rights, property, and
              safety of Demos or others. Demos may also share personally identifiable information in connection with, or during negotiations
              of, any merger, sale of company assets, financing or acquisition of all or a portion of its business to another company.
              Moreover, Demos may share personally identifiable information about a User upon obtaining the User’s consent.
            </p>
            <br />
            <p>
              Demos may share generic aggregated demographic information not linked to any personally identifiable information regarding
              Users with third parties.
            </p>
            <h3 class="text-h3 my-4">Contacting Demos</h3>
            <p>
              If you have any questions about this Privacy Policy or anything relating to the Website, please contact Demos at
              info@demos.org.
            </p>
            <h3 class="text-h3 my-4">August 2, 2024</h3>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <NewsLetter />
    <FooterSection />
  </v-layout>
</template>
