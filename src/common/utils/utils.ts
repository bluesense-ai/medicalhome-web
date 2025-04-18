// src/utils/utils.ts
import { XMLParser } from "fast-xml-parser";

export const calculateAge = (dateOfBirth: string): any => {
  if (!dateOfBirth) 
    return "";
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return Math.max(age, 0); 
};

export const validateFile = (file: any) => {
  const audioFileExtentions = ["mp3", "wav", "m4a"];
  const allowedFileTypes = ["mp3", "wav", "m4a", "mp4", "mpeg", "mpga", "webm"];
  const fileExtension = file.name.split(".").pop().toLowerCase();
  if (audioFileExtentions.includes(fileExtension)) {
  }
  if (!allowedFileTypes.includes(fileExtension)) {
    return {
      valid: false,
      message:
        "Invalid file type allowed are mp3, mp4, mpeg, mpga, wav, webm, m4a, wav",
    };
  }

  if (file.type.startsWith("audio/") && file.size > 24 * 1024 * 1024) {
    return { valid: false, message: "Audio file size exceeds 24 MB limit" };
  }

  if (file.type.startsWith("video/")) {
    if (file.size > 1.8 * 60 * 60 * 1024 * 1024) {
      return { valid: false, message: "Video duration exceeds 1.8 hours" };
    }
    if (file.size > 1024 * 1024 * 25) {
      return { valid: false, message: "Video file size exceeds 25 MB limit" };
    }
  }

    return { valid: true, message: "File is valid" };
  };
  
  export const detectBrowser = () => {
    const userAgent = navigator.userAgent;
    if (/firefox|fxios/i.test(userAgent)) {
      return 'Firefox';
    } else if (/chrome|chromium|crios/i.test(userAgent)) {
      return 'Chrome';
    } else if (/safari/i.test(userAgent) && !/chrome|chromium|crios/i.test(userAgent)) {
      return 'Safari';
    } else if (/edg/i.test(userAgent)) {
      return 'Edge';
    } else {
      return 'Unknown';
    }
  };
  

export const formatDate = (date:any) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(dateObj);
  }


export const parseXml = (xmlString: string) => {
  const parser = new XMLParser();
  const parsedXml = parser.parse(xmlString);
  return parsedXml;
};

export const normalizeDate = (date:any) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); 
  return d.getTime();
};