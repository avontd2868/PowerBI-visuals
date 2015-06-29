//-----------------------------------------------------------------------
// This code was taken from "Opiniate" written by Pedram Rezaei.
// Microsoft can use this code but cannot copyright it as its own
//-----------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using Microsoft.Build.Framework;
using Microsoft.Build.Utilities;

namespace Microsoft.InfoNav.Build.Tasks
{
    public sealed class PrefetchAngularTemplates : Task
    {
        [Required]
        public ITaskItem[] HtmlItems { get; set; }

        [Required]
        public string OutputJavaScript { get; set; }

        [Required]
        public string AngularAppName { get; set; }

        public string AngularAppPath { get; set; }

        public string TemplateNameExclude { get; set; }

        public override bool Execute()
        {
            if (HtmlItems.Length == 0 || string.IsNullOrWhiteSpace(OutputJavaScript) || string.IsNullOrWhiteSpace(AngularAppName))
                return true;

            string[] nameExcludeDir = GetNameExcludeDir();

            var sb = new StringBuilder();
            sb.AppendFormat("angular.module('{0}').run(['$templateCache', function (t) {{", AngularAppName);
            foreach (var htmlItem in HtmlItems)
            {
                var fileInfo = new FileInfo(htmlItem.ItemSpec);
                if (!fileInfo.Exists)
                    continue;

                var fullPath = fileInfo.FullName;
                var templateLines = File.ReadAllLines(fullPath);
                sb.Append("t.put('");
                AppendTemplateName(nameExcludeDir, fileInfo, sb);
                sb.Append("', '");
                for (int i = 0; i < templateLines.Length; i++)
                    sb.AppendLine(HttpUtility.JavaScriptStringEncode(templateLines[i]) + "\\");

                sb.Append("');");
            }
            sb.AppendLine("}]);");
            File.WriteAllText(OutputJavaScript, sb.ToString());
            return true;
        }

        private static void AppendTemplateName(string[] nameExcludeDir, FileInfo fileInfo, StringBuilder sb)
        {
            if (nameExcludeDir != null)
            {
                var dir = GetParents(fileInfo.Directory).Reverse().ToArray();
                for (int i = 0; i < dir.Length; i++)
                {
                    if (i >= nameExcludeDir.Length)
                    {
                        sb.Append(dir[i]);
                        sb.Append('/');
                    }
                    else if (!StringComparer.OrdinalIgnoreCase.Equals(dir[i], nameExcludeDir[i]))
                    {
                        break;
                    }
                }
            }
            sb.Append(fileInfo.Name);
        }

        private static IEnumerable<string> GetParents(DirectoryInfo dir)
        {
            while (dir != null)
            {
                yield return dir.Name;
                dir = dir.Parent;
            }
        }

        private string[] GetNameExcludeDir()
        {
            if (!string.IsNullOrWhiteSpace(TemplateNameExclude))
            {
                var dirInfo = new DirectoryInfo(TemplateNameExclude);
                if (dirInfo.Exists)
                    return GetParents(dirInfo).Reverse().ToArray();
            }
            return null;
        }
    }
}
