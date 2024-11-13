import React from 'react';
import Placeholder from "rn-placeholder";

const styles= {
  paragraph: {
    marginTop: 10,
    marginBottom: 10
  }
};

const ContentPlaceholder=(props)=>{
  let paragraphs=[];

  for(let i=0;i<props.totalParagraphs;i++){
    paragraphs.push(
      <Placeholder.Paragraph
        key={i}
        animate="shine"
        lineNumber={3}
        lineSpacing={5}
        firstLineWidth="90%"
        lastLineWidth="70%"
        style={styles.paragraph}
        onReady={!props.waitingRequest}/>
    )
  }

  return(
    <React.Fragment>
      {paragraphs}
    </React.Fragment>
  )
};

export default ContentPlaceholder;
