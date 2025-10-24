import { Instagram, Linkedin, Mail } from 'lucide-react';

export default function HeaderRedes() {
    return (
        <div className="mt-[15px] flex justify-center sm:mt-[20px] sm:justify-end">
            <a
                href="https://www.instagram.com/revistabarcodepapel/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-fucsia mr-[6px] rounded-[50%] p-[4px] transition-transform hover:scale-110 sm:mr-[8px] sm:p-[5px]"
            >
                <Instagram size={20} className="sm:size-6" />
            </a>
            <a
                href="https://www.linkedin.com/company/barco-de-papel/about/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-fucsia mx-[6px] rounded-[50%] p-[4px] transition-transform hover:scale-110 sm:mr-[8px] sm:p-[5px]"
            >
                <Linkedin size={20} className="sm:size-6" />
            </a>
            <a
                href="mailto:catabilleke@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-fucsia ml-[6px] rounded-[50%] p-[4px] transition-transform hover:scale-110 sm:ml-[8px] sm:p-[5px]"
            >
                <Mail size={20} className="sm:size-6" />
            </a>
        </div>
    );
}
