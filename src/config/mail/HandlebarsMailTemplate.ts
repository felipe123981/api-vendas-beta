import Handlebars from 'handlebars';
import fs from 'fs';
import { ITemplateVariable, IParseMailTemplate } from '@config/mail/@types/MailTemplates';

export default class handlebarsMailTemplate {
  public async parse({ file, variables }: IParseMailTemplate): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });
    const parseTemplate = Handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}
