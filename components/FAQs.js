import React from "react";

import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from "react-accessible-accordion";

// Demo styles, see 'Styles' section below for some notes on use.
import "react-accessible-accordion/dist/fancy-example.css";

export default function FAQs() {
    return (
        <Accordion>
            <AccordionItem>
                <AccordionItemHeading>
                    <AccordionItemButton>How frequent do you optimize images?</AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                    <p>
                        Exercitation in fugiat est ut ad ea cupidatat ut in cupidatat occaecat ut occaecat consequat est
                        minim minim esse tempor laborum consequat esse adipisicing eu reprehenderit enim.
                    </p>
                </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem>
                <AccordionItemHeading>
                    <AccordionItemButton>Why should I care about the alt text at all?</AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                    <p>
                        In ad velit in ex nostrud dolore cupidatat consectetur ea in ut nostrud velit in irure cillum
                        tempor laboris sed adipisicing eu esse duis nulla non.
                    </p>
                </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem>
                <AccordionItemHeading>
                    <AccordionItemButton>What would happen If I were to remove your app?</AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                    <p>
                        In ad velit in ex nostrud dolore cupidatat consectetur ea in ut nostrud velit in irure cillum
                        tempor laboris sed adipisicing eu esse duis nulla non.
                    </p>
                </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem>
                <AccordionItemHeading>
                    <AccordionItemButton>I have another question where can I find you?</AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                    <p>
                        In ad velit in ex nostrud dolore cupidatat consectetur ea in ut nostrud velit in irure cillum
                        tempor laboris sed adipisicing eu esse duis nulla non.
                    </p>
                </AccordionItemPanel>
            </AccordionItem>
        </Accordion>
    );
}
